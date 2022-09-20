const { buildAuthenticatedRouter } = require('@admin-bro/express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const User = require('../models/user');

/**
 * @param {AdminBro} admin
 * @return {express.Router} router
 */

const buildAdminRouter = (admin) => {
  const router = buildAuthenticatedRouter(
    admin,
    {
      cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
      cookiePassword:
        process.env.ADMIN_COOKIE_PASS ||
        'secret-long-password-for-admin-bro-login',
      authenticate: async (email, password) => {
        const user = await User.findOne({ email });
        if (user) {
          const matched = await bcrypt.compare(password, user.password);
          if (matched) {
            if (user.role === 'admin') {
              return user;
            }
          }
        }
        return false;
      },
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: process.env.MONGOURI }),
    },
  );
  return router;
};

module.exports = buildAdminRouter;
