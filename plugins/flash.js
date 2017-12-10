module.exports = app => {
  app.use(async (ctx, next) => {
    ctx.flash = (type, message) => {
      if (!Array.isArray(ctx.session.flashMessages)) {
        ctx.session.flashMessages = [];
      }
      ctx.session.flashMessages.push({ type, message });
    };
    await next();
  });
};
