const favicon = require("koa-favicon");

module.exports = app => {
  app.use(favicon("./public/favicon.ico"));
};
