module.exports = app => {
  app.use(async (ctx, next) => {
    if (ctx.method === "GET") {
      // csrf getter
      ctx.state.csrf = () => ctx.csrf;

      // flash messages
      const { flashMessages } = ctx.session;
      if (Array.isArray(flashMessages) && flashMessages.length) {
        ctx.state.flashMessages = flashMessages;
        delete ctx.session.flashMessages;
      }

      // old form
      ctx.state.oldForm = ctx.session.oldForm || {};
      delete ctx.session.oldForm;
    }

    await next();
  });
};
