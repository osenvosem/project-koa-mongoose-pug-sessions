const views = require("koa-views");
const moment = require("moment");
const config = require("config");
const validation = config.get("validation");

module.exports = app => {
  app.use(
    views("./views", {
      extension: "pug",
      options: {
        cache: process.env.NODE_ENV === "production",
        moment,
        validation
      }
    })
  );
};
