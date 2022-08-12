const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/user');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../config/keys');

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ userId: profile.id }).then((existingUser) => {
        if (existingUser) {
          cb(null, existingUser);
        } else {
          new User({
            username: profile.emails[0].value.split('@')[0],
            email: profile.emails[0].value,
            name: profile.displayName,
            pic: profile.photos[0].value,
            provider: profile.provider,
            providerId: profile.id,
          })
            .save()
            .then((user) => {
              cb(null, user);
            });
        }
      });
    },
  ),
);

passport.serializeUser((user, cb) => {
  const { _id, name, email, username, followers, following, pic } = user;
  const usr = { _id, name, email, username, followers, following, pic };
  cb(null, usr);
});

passport.deserializeUser((_id, cb) => {
  User.find({ _id }, (err, user) => {
    cb(null, user);
  });
});
