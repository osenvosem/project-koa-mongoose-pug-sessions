const Router = require("koa-router");
const router = new Router();
const User = require("../models/User");
const _ = require("lodash");

router.get("/registration", async ctx => {
  await ctx.render("registration");
});

router.post("/registration", async ctx => {
  // filter out the empty fields
  const body = _.pickBy(ctx.request.body, val => !!val.trim());
  const user = await User.create(body);
  await ctx.login(user);

  ctx.redirect("/");
});

module.exports = router;
