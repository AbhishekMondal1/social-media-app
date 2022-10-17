require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const http = require('http');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const compression = require('compression');
const RedisStore = require('connect-redis')(session);
const path = require('path');

const authRoute = require('./routes/auth');
const passportAuthRoutes = require('./routes/passportAuth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');
const notificationRoute = require('./routes/notification');

const adminbroServer = require('./admin/adminServer');

const { dbconnection } = require('./database/mongodb');
const { redisStoreClient } = require('./database/redis');

const { notificationSocket, messageSocket } = require('./listeners/socketio');

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

app.use(cors(corsOptions));
app.enable('trust proxy');

// database connection
dbconnection();

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const sessionMiddleware = session({
  name: 'socialsession',
  store: new RedisStore({
    client: redisStoreClient,
  }),
  credentials: true,
  maxAge: 60 * 60 * 1000,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);

// passportjs routes
app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport_setup');

app.use('/auth', passportAuthRoutes);

// routes
app.use(authRoute);
app.use(userRoute);
app.use(postRoute);
app.use('/conversation', conversationRoute);
app.use('/messages', messageRoute);
app.use('/notifications', notificationRoute);

const adminRouter = require('./admin/admin.router');

app.use('/admin', adminRouter);
// app.use(require('./routes/adminroutes'));

// app.use(adminBro.options.rootPath, adminrouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// socketio
notificationSocket(httpServer, sessionMiddleware);
messageSocket(httpServer, sessionMiddleware);

adminbroServer();

httpServer.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
