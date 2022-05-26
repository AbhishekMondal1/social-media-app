const passport = require('passport'); 

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (user, cb) {
  //User.findById(id, function (err, user) {
    cb(null, user);
  //});
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "125457807709-2to2thmbdplnqnjmr0jq1s545p590cr3.apps.googleusercontent.com",
      clientSecret: "Cttfh0lxyBh8D16ALFdn4Huh",
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      console.log(profile);
      return cb(null, profile);
      //});
    }
  )
);
