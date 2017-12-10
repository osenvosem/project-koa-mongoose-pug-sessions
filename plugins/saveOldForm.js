const _ = require("lodash");

module.exports = app => {
  app.use(async (ctx, next) => {
    const { body } = ctx.request;
    const { method } = ctx;
    if (method === "POST" && Object.keys(body).length) {
      ctx.session.oldForm = _.pickBy(body, val => !!val.trim());
    }

    await next();
  });
};
