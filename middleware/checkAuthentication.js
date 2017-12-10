module.exports = async function() {
  if (arguments.length > 3)
    throw new Error("The middleware expects 2 or 3 arguments.");

  arguments.length === 2
    ? ([ctx, next] = arguments)
    : ([, ctx, next] = arguments);

  if (ctx.isAuthenticated()) {
    await next();
  } else {
    ctx.flash("warning", "Please log in to get access to the page.");
    ctx.redirect("/login");
  }
};
