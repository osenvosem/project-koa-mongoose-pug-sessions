const Router = require("koa-router");
const _ = require("lodash");
const router = new Router({ prefix: "/user" });
const User = require("../models/User");
const checkAuthentication = require("../middleware/checkAuthentication");
const checkAuthorisation = require("../middleware/checkAuthorisation");

router.param("username", checkAuthentication);

router.get("/:username", async ctx => {
  const userDetails = await User.findOne({
    username: ctx.params.username
  }).lean();
  ctx.assert(userDetails, 404, "There is no such user.");

  await ctx.render("user-details", { userDetails });
});

router.get("/:username/edit", checkAuthorisation, async ctx => {
  await ctx.render("edit-profile");
});

router.post("/:username/edit", checkAuthorisation, async ctx => {
  const body = _.pickBy(ctx.request.body, val => !!val.trim());
  const user = await User.findById(ctx.state.user._id);
  user.set(body);
  await user.save();

  ctx.flash("info", "Your profile has been updated.");
  ctx.redirect(`/user/${user.username}`);
});

router.post("/:username/delete", checkAuthorisation, async ctx => {
  await User.findOneAndRemove({ username: ctx.params.username });

  ctx.flash("info", "Your account has been deleted.");
  ctx.redirect("/login");
});

module.exports = router;
