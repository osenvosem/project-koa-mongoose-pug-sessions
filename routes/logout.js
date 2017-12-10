const Router = require("koa-router");
const router = new Router();

router.get("/logout", ctx => {
  ctx.logout();
  ctx.redirect("/login");
});

module.exports = router;
