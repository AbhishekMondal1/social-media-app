const io = require("socket.io")(9010, {
  cors: {
    origin: "https://localhost:3005",
  },
});

let users = [];

// add user to users list
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log(users);
};

// remove user from users list
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
  console.log(users);
};

// get userid of msg receiver
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // when connect
  console.log("a user connected.", socket.id);

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
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

  // when disconnect remove the user from user list and fetch new users list
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
