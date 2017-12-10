const CSRF = require("koa-csrf");

module.exports = app => {
  app.use(new CSRF());
};
