const passport = require("koa-passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");

module.exports = app => {
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });
  passport.deserializeUser(async (username, done) => {
    const user = await User.findOne({ username }).lean();
    done(null, user);
  });

  // configure local strategy
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username }, (err, user) => {
        if (err) return done(err);
        if (!user)
          return done(null, false, "The username you provided is incorrect.");
        if (!user.checkPassword(password))
          return done(null, false, "The password you provided is incorrect.");
        done(null, user);
      });
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
