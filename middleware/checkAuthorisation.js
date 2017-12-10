module.exports = async (ctx, next) => {
  if (ctx.state.user.username === ctx.params.username) {
    await next();
  } else {
    ctx.flash("error", "You aren't authorised to do this.");
    ctx.status = 401;
    ctx.redirect("/");
  }
};
