const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

router.get("/login", async ctx => {
  await ctx.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

module.exports = router;
