const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')
const cors = require('cors')
const bodyParser = require('body-parser')
const { urlencoded, json } = require('body-parser')
const passport = require('passport')
const cookieSession = require("cookie-session");
const { log } = require('console')
const run = require('./admin/adminServer')
app.use(cors())

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
  

  
  
  const conversationRoute = require('./routes/conversations')
  const messageRoute = require('./routes/messages')
  require('./models/user')
  require('./models/comment')
  require('./models/post')
  app.use(express.json())
  app.use(require('./routes/auth'))
  app.use(require('./routes/post'))
  app.use(require('./routes/user'))
  app.use("/conversation", conversationRoute)
  app.use("/messages", messageRoute)
  app.use(require('./routes/messages'))
  const adminRouter = require('./admin/admin.router')
app.use('/admin', adminRouter)
// app.use(require('./routes/adminroutes'))
require('./middleware/passport_setup')

//app.use(adminBro.options.rootPath, adminrouter);
/*
app.use(bodyParser,urlencoded({extended:false}))

app.use(bodyParser, json())
const isLoggedin = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.sendStatus(401);
    }
}

app.use(
  cookieSession({
    name: "connectall-session",
    keys: ["key1", "key2"],
  })
);
*/
/*
const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
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
      console.log(profile);
      return cb(err, profile);
    }
  )
);*/
//app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(passport.initialize()); 
//app.use(passport.session());  // ////
/* app.get('/',(req,res)=> res.send('not logged in'))
app.get('/failuer', (req, res) => res.send("you are failed to login"))
app.get('/success', isLoggedin, (req, res) => res.send(`Welcome ${req.user.email} `))

app.get("/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/auth/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  }),
  (req, res) => {
    res.redirect("/");
    res.end("logged in");
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/')
})
*/
// ///


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    console.log(res)
    res.redirect("http://localhost:3000/signin");
  }
);



if (process.env.NODE_ENV == "production") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

run()

app.listen(PORT, () => {  
    console.log("Server is Running",PORT); 
})