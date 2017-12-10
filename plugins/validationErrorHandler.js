// separate validation error handler placed below the sessions middleware in order to use sessions inside
module.exports = app => {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      if (e.name === "ValidationError") {
        ctx.status = 400;

        for (const field in e.errors) {
          ctx.flash("error", e.errors[field].message);
        }

        ctx.redirect("back");
      } else throw e;
    }
  });
};
