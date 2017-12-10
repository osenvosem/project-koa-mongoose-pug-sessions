const bodyParser = require("koa-body");

module.exports = app => {
  app.use(
    bodyParser({
      multipart: true,
      jsonLimit: "56kb",
      formidable: { keepExtensions: true, uploadDir: "./files" }
    })
  );
};
