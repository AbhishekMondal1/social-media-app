const passport = require('passport'); 

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  //User.findById(id, function (err, user) {
    done(null, user);
  //});
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "125457807709-hsp5un14r9g774c6f464e740kue1kb2d.apps.googleusercontent.com",
      clientSecret: "MP2Wd_1JrCfykA_Axvkj3pLI",
      callbackURL: "http://localhost:3000/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      //User.findOrCreate({ googleId: profile.id }, function (err, user) {
          console.log(user)
        return cb(err, user);
      //});
    }
  )
);