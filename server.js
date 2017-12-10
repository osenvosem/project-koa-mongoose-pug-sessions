const Koa = require("koa");
const config = require("config");

const app = new Koa();

app.keys = config.get("secrets");

const plugins = [
  "errorHandler",
  "logger",
  "favicon",
  "serveStatic",
  "sessions",
  "flash",
  "bodyParser",
  "saveOldForm",
  "validationErrorHandler",
  "templates",
  "mongoose",
  "passport",
  "csrf",
  "populateState"
];
plugins.forEach(filename => {
  require(`./plugins/${filename}`)(app);
});

// plugin in routes
const routes = ["users", "login", "logout", "registration", "frontpage"];
routes.forEach(filename => {
  app.use(require(`./routes/${filename}`).routes());
  app.use(require(`./routes/${filename}`).allowedMethods());
});

module.exports = app;
