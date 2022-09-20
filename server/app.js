require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const run = require('./admin/adminServer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'https://localhost:3005',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

// database connection
const { dbconnection } = require('./database/mongodb');

dbconnection();

app.use(
  cookieSession({
    name: 'socialsession',
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['secret'],
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');
const notificationRoute = require('./routes/notification');
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

app.use('/conversation', conversationRoute);
app.use('/messages', messageRoute);

const adminRouter = require('./admin/admin.router');

app.use('/admin', adminRouter);
app.use('/notifications', notificationRoute);
// app.use(require('./routes/adminroutes'))
require('./middleware/passport_setup');

app.get('/check', (req, res) => {
  console.log('req', req);
  console.log('res', res);
  res.json({ s: 'ok' });
});

// app.use(adminBro.options.rootPath, adminrouter);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('https://localhost:3005/');
  },
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const { notificationSocket, messageSocket } = require('./listeners/socketio');

// socketio
notificationSocket('https://localhost:3005');
messageSocket('https://localhost:3005');

run();

app.listen(PORT, () => {
  console.log('Server is Running', PORT);
});
