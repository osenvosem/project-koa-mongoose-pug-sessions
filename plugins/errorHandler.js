module.exports = app => {
  app.use(async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404) {
        const err = new Error();
        err.status = 404;
        err.message = "Page not found";
        throw err;
      }
    } catch (e) {
      console.error(e);
      let { status, message } = e;
      if (!status) {
        status = 500;
        message: "Internal server error.";
      }
      await ctx.render("error", { status, message });
    }
  });
  // process.on("unhandledRejection", (reason, promise) => {
  //   throw reason;
  // });
};
