const passport = require('passport');

const googleAuthenticate = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

const googleCallbackAuthenticate = passport.authenticate('google', {
  failureRedirect: '/failure',
});

const googleCallback = (req, res) => {
  res.redirect('http://localhost:3005/');
};

module.exports = {
  googleAuthenticate,
  googleCallbackAuthenticate,
  googleCallback,
};
