const session = require("koa-session");
const mongooseStore = require("./koa-session-mongoose");

module.exports = app => {
  app.use(
    session(
      {
        key: "sid",
        httpOnly: true,
        path: "/",
        overwrite: true,
        signed: false,
        maxAge: 3600 * 4 * 1e3,
        rolling: true,
        store: new mongooseStore({
          modelName: "Session",
          expires: 3600 * 4
        })
      },
      app
    )
  );
};
