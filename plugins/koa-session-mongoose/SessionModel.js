module.exports = function({
  connection,
  collection,
  modelName = "Session",
  expires = 3600 * 24 * 14 // two weeks
}) {
  const mongoose = connection ? connection.base : require("mongoose");
  const { Schema } = mongoose;

  const sessionSchema = new Schema({
    sid: {
      type: String,
      required: true,
      unique: true
    },
    data: Object,
    updatedAt: {
      type: Date,
      expires,
      default: new Date()
    }
  });

  if (collection) sessionSchema.set("collection", collection);

  return mongoose.model(modelName, sessionSchema);
};
