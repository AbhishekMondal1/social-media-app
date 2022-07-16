const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')
const { JWT_SECRET } = require('./config/keys')
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
const User = require('./models/user')
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

// --------- socket.io ----------
const io = require("socket.io")(9010, {
  cors: {
    origin: "https://localhost:3005",
  },
});

let onlineUsers = [];

// add user to onlineUsers list
const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
  console.log(onlineUsers);
};

// remove user from onlineUsers list
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  console.log(onlineUsers);
};

// get userid of msg receiver
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const getUserSocket = async (userId) => {
  return await onlineUsers.find((user) => user.userId == userId);
};

const getUserIdBySocketId = async (socketId) => {
  return await onlineUsers.find((user) => user.socketId == socketId);
};

const findOnlinefollowingUsers = async (userId) => {
  const userid = mongoose.Types.ObjectId(userId);
  const followingUsersIds = await User.aggregate([
    {
      '$match': {
        '_id': userid,
      }
    }, {
      '$project': {
        'following': 1
      }
    }
  ])
  if (followingUsersIds[0]) {
    const onlineFollowingUsersIds = followingUsersIds[0].following.filter((f) => onlineUsers.some((u) => u.userId == f))
    return onlineFollowingUsersIds
  }
}

const findOnlinefollowerUsers = async (userId) => {
  const userid = mongoose.Types.ObjectId(userId);
  const followerUsersIds = await User.aggregate([
    {
      '$match': {
        '_id': userid,
      }
    }, {
      '$project': {
        'followers': 1
      }
    }
  ])
  if (followerUsersIds[0]) {
    const onlineFollowerUsersIds = followerUsersIds[0].followers.filter((f) => onlineUsers.some((u) => u.userId == f))
    return onlineFollowerUsersIds
  }
}

io.on("connection", (socket) => {
  // when connect
  jwt.verify(socket.handshake.query.token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("err", err);
    } else {
      //take userId and socketId from user
      socket.on("addUser", async (userId) => {
        if (userId != null) {
          addUser(userId, socket.id);
          const onlineUsersIds = await findOnlinefollowingUsers(userId)
          const usersocket = getUser(userId);
          io.to(usersocket?.socketId).emit("getUsers", onlineUsersIds);

          const onlineFollowersIds = await findOnlinefollowerUsers(userId)
          onlineFollowersIds?.forEach(async (followerId) => {
            const followersocket = await getUserSocket(followerId);
            io.to(followersocket?.socketId).emit("followerConnected", [userId]);
          })
        }
      });

      // send and get message
      socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        try {
          const user = getUser(receiverId);
          io.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
          });
        } catch (error) {
          console.log("Error occured", error)
        }
      });

      // when disconnect remove the user from user list and fetch new onlineUsers list
      socket.on("disconnect", async () => {
        const user = await getUserIdBySocketId(socket.id);
        if (user?.userId != null) {
          const userId = user.userId;
          const onlineFollowersIds = await findOnlinefollowerUsers(userId)
          onlineFollowersIds?.forEach(async (followerId) => {
            const followersocket = await getUserSocket(followerId);
            io.to(followersocket?.socketId).emit("followerDisconnected", [userId]);
          })
          removeUser(socket.id);
        }
      });
    }
  })
}
);


run()

app.listen(PORT, () => {
  console.log("Server is Running", PORT);
})