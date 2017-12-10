const serveStatic = require("koa-static");

module.exports = app => {
  app.use(serveStatic("./public"));
};
