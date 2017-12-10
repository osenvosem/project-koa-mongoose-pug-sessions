const mongoose = require("mongoose");
const config = require("config");
const beautifulUnique = require("mongoose-beautiful-unique-validation");

module.exports = app => {
  // plugins
  mongoose.plugin(beautifulUnique);

  // mongoose always shows error while testing with Jest
  if (process.env.NODE_ENV === "development") {
    // mongoose.set("debug", true);
  }

  mongoose.Promise = global.Promise;

  const conn = mongoose
    .connect(config.get("dbUrl"), {
      useMongoClient: true
    })
    .then(db => {
      db.on("error", console.error);
      db.once("open", () => {
        // console.log("DB connected");
      });
    });
};
