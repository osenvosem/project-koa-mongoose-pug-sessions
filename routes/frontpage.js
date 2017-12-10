const Router = require("koa-router");
const router = new Router();
const User = require("../models/User");
const checkAuthentication = require("../middleware/checkAuthentication");

router.get("/", checkAuthentication, async ctx => {
  const users = await User.find().lean();
  await ctx.render("frontpage", { users });
});

module.exports = router;
