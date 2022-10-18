const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { redisClient } = require('../database/redis');
const User = require('../models/user');

// Chat Socket
const chatSocket = (httpServer, sessionMiddleware) => {
  const io = socketio(httpServer, {
    path: '/chat',
  });

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  // add user to onlineUsers list
  const addUser = async (userId, socketId) => {
    await redisClient.hSet(
      'onlineUsers',
      `userId:${userId}`,
      JSON.stringify({ socketId }),
    );
  };

  // remove user from onlineUsers list
  const removeUser = async (userId) => {
    await redisClient.hDel('onlineUsers', `userId:${userId}`);
  };

  // get socketid of msg receiver
  const getUser = async (userId) => {
    let user = await redisClient.hGet('onlineUsers', `userId:${userId}`);
    if (user) {
      user = JSON.parse(user);
      return user;
    }
  };

  const findOnlinefollowingUsers = async (userId) => {
    const userid = mongoose.Types.ObjectId(userId);
    const followingUsersIds = await User.aggregate([
      {
        $match: {
          _id: userid,
        },
      },
      {
        $project: {
          following: 1,
        },
      },
    ]);

    const onlineFollowings = async (followId) => {
      const isOnline = await redisClient.hExists(
        'onlineUsers',
        `userId:${followId}`,
      );
      return isOnline;
    };

    const onlineFollowingUsersIds = [];

    if (followingUsersIds[0]) {
      const promises = followingUsersIds[0].following.map(async (followId) => {
        const isOnline = await onlineFollowings(followId);
        if (isOnline) {
          onlineFollowingUsersIds.push(followId);
        }
      });
      await Promise.all(promises);
      return onlineFollowingUsersIds;
    }
  };

  const findOnlinefollowerUsers = async (userId) => {
    const userid = mongoose.Types.ObjectId(userId);
    const followerUsersIds = await User.aggregate([
      {
        $match: {
          _id: userid,
        },
      },
      {
        $project: {
          followers: 1,
        },
      },
    ]);

    const onlineFollowers = async (followId) => {
      const isOnline = await redisClient.hExists(
        'onlineUsers',
        `userId:${followId}`,
      );
      return isOnline;
    };

    const onlineFollowerUsersIds = [];

    if (followerUsersIds[0]) {
      const promises = followerUsersIds[0].followers.map(async (followId) => {
        const isOnline = await onlineFollowers(followId);
        if (isOnline) {
          onlineFollowerUsersIds.push(followId);
        }
      });
      await Promise.all(promises);
      return onlineFollowerUsersIds;
    }
  };

  // socket events for chat
  const chatSocketEvents = (socket, decoded) => {
    console.log('PARAMETER', socket, 'dec', decoded);
    socket.on('addUser', async (userId) => {
      if (userId != null) {
        addUser(userId, socket.id);
        const onlineUsersIds = await findOnlinefollowingUsers(userId);
        const usersocket = await getUser(userId);
        io.to(usersocket?.socketId).emit('getUsers', onlineUsersIds);
        const onlineFollowersIds = await findOnlinefollowerUsers(userId);
        onlineFollowersIds?.forEach(async (followerId) => {
          const followersocket = await getUser(followerId);
          io.to(followersocket?.socketId).emit('followerConnected', [userId]);
        });
      }
    });

    // send and get message
    socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
      try {
        const user = await getUser(receiverId);
        io.to(user?.socketId).emit('getMessage', {
          senderId,
          text,
        });
      } catch (error) {
        console.log('Error occured', error);
      }
    });

    // when disconnect remove the user from user list and fetch new onlineUsers list
    socket.on('disconnect', async () => {
      const user = decoded
        ? await getUser(decoded?._id)
        : await getUser(socket.request.session.passport.user._id);
      if (user?.socketId != null) {
        const userId = decoded
          ? decoded?._id
          : socket.request.session.passport.user._id;
        const onlineFollowersIds = await findOnlinefollowerUsers(userId);
        onlineFollowersIds?.forEach(async (followerId) => {
          const followersocket = await getUser(followerId);
          io.to(followersocket?.socketId).emit('followerDisconnected', [
            userId,
          ]);
        });
        removeUser(
          decoded ? decoded?._id : socket.request.session.passport.user._id,
        );
      }
    });
  };

  // establish chat socket connection
  io.on('connection', (socket) => {
    console.log('a user connected', socket.request.session);
    if (!socket.request.session.passport && socket.request.session.jwtToken) {
      jwt.verify(
        socket.request.session?.jwtToken,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            console.log('err', err);
          } else {
            chatSocketEvents(socket, decoded);
          }
        },
      );
    } else if (socket.request.session.passport) {
      chatSocketEvents(socket);
    }
  });
  return io;
};

module.exports = { chatSocket };
