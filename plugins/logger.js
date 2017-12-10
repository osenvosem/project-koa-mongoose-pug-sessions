const logger = require("koa-logger");

module.exports = app => {
  if (app.env === "development") app.use(logger());
};
