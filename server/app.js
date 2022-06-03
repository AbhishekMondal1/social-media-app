const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')
const cors = require('cors')
const bodyParser = require('body-parser')
const { urlencoded, json } = require('body-parser')
const passport = require('passport')
const cookieSession = require("cookie-session");
const run = require('./admin/adminServer')
const cookieParser = require('cookie-parser');

app.use(cors({
  origin: "https://localhost:3005",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}))

const dbconnection = mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
  console.log("Mongoose CONNECTED!!")
})
mongoose.connection.on('error', (err) => {
  console.log("err connection", err)
})


app.use(cookieSession({
  name: 'socialsession',
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['secret'],
  resave: false,
  saveUninitialized: true
}))

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const conversationRoute = require('./routes/conversations')
const messageRoute = require('./routes/messages')
require('./models/user')
require('./models/comment')
require('./models/post')
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
app.use("/conversation", conversationRoute)
app.use("/messages", messageRoute)
const adminRouter = require('./admin/admin.router')
app.use('/admin', adminRouter)
// app.use(require('./routes/adminroutes'))
require('./middleware/passport_setup')

app.get("/check", (req, res) => {
  console.log('req', req);
  console.log('res', res);
  res.json({ s: "ok" });
});

//app.use(adminBro.options.rootPath, adminrouter);
/*
app.use(bodyParser,urlencoded({extended:false}))

app.use(bodyParser, json())

*/

app.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect("https://localhost:3005/")
  }
);

if (process.env.NODE_ENV == "production") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

run()

app.listen(PORT, () => {
  console.log("Server is Running", PORT);
})