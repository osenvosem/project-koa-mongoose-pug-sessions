const crypto = require("crypto");
const config = require("config");
const mongoose = require("mongoose");

const { Schema } = mongoose;
const validation = config.get("validation");

const userSchema = new Schema({
  username: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: "User with the username {VALUE} already exists.",
    lowercase: true,
    trim: true,
    validate: {
      validator: new RegExp(validation.username),
      message:
        "Username must consist of alphanumeric characters and underscores, {VALUE} was given."
    }
  },
  email: {
    type: String,
    required: true,
    unique: "User with the email {VALUE} already exists.",
    lowercase: true,
    trim: true,
    validate: {
      validator: new RegExp(validation.email),
      message: "Must be a valid email, {VALUE} was given."
    }
  },
  firstName: {
    type: String,
    maxlength: 30,
    trim: true,
    validate: {
      validator: new RegExp(validation.firstName),
      message:
        "First name must consist of alphanumeric characters, {VALUE} was given."
    }
  },
  lastName: {
    type: String,
    maxlength: 30,
    trim: true,
    validate: {
      validator: new RegExp(validation.lastName),
      message:
        "Last name must consist of alphanumeric characters, {VALUE} was given."
    }
  },
  salt: {
    type: String
  },
  password: {
    type: String,
    set(password) {
      password = password.trim();
      if (!password) throw new Error("Password is required.");
      if (password.length < 6)
        throw new Error("Password must be at least 6 characters long.");
      if (password.length > 30)
        throw new Error("Password can't be longer than 30 characters.");

      const { iterations, length, algorithm } = config.get("crypto.hash");

      this.salt = crypto.randomBytes(length).toString("base64");

      return crypto
        .pbkdf2Sync(password, this.salt, iterations, length, algorithm)
        .toString("base64");
    }
  }
});

userSchema.set("timestamps", true);

userSchema.statics.publicFields = [
  "username",
  "firstName",
  "lastName",
  "email",
  "createdAt",
  "updatedAt"
];

userSchema.methods.checkPassword = function(password) {
  if (!password) return false;

  const { iterations, length, algorithm } = config.get("crypto.hash");
  return (
    crypto
      .pbkdf2Sync(password, this.salt, iterations, length, algorithm)
      .toString("base64") === this.password
  );
};

module.exports = mongoose.model("User", userSchema);
