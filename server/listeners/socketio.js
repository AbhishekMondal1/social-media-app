const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { redisClient } = require('../database/redis');
const User = require('../models/user');
const Notification = require('../models/notification');

// Notification Socket
const notificationSocket = (httpServer, sessionMiddleware) => {
  const ioNotification = socketio(httpServer, {
    path: '/notification',
  });

  ioNotification.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });
  // add user to globalOnlineUsers list
  const addGlobalUser = async (userId, socketId) => {
    await redisClient.hSet(
      'globalOnlineUsers',
      `userId:${userId}`,
      JSON.stringify({ socketId }),
    );
  };

  // remove user from globalOnlineUsers list
  const removeGlobalUser = async (userId) => {
    await redisClient.hDel('globalOnlineUsers', `userId:${userId}`);
  };

  // get socketid of notification receiver
  const getGlobalUser = async (userId) => {
    let user = await redisClient.hGet('globalOnlineUsers', `userId:${userId}`);
    if (user) {
      user = JSON.parse(user);
      return user;
    }
  };

  ioNotification.on('connection', (socket) => {
    jwt.verify(
      socket.request.session?.jwtToken,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          console.log('err', err);
        } else {
          socket.on('joinNotification', async (userId) => {
            if (userId != null) {
              addGlobalUser(userId, socket.id);
            }
          });
          socket.on(
            'sendNotification',
            async ({ senderId, receiverId, postId, notificationType }) => {
              if (
                senderId != null &&
                receiverId != null &&
                postId != null &&
                notificationType != null
              ) {
                if (senderId !== receiverId) {
                  const user = await getGlobalUser(receiverId);

                  // insert into notifications collection
                  const senderUser = await User.findById(senderId);
                  let notificationText = '';
                  if (notificationType === 'like') {
                    notificationText = `${senderUser.username} liked your post.`;
                  }
                  if (notificationType === 'comment') {
                    notificationText = `${senderUser.username} commented on your post.`;
                  }
                  if (notificationType === 'follow') {
                    notificationText = `${senderUser.username} started following you.`;
                  }
                  const notification = new Notification({
                    senderId,
                    receiverId,
                    notificationType,
                    notificationText,
                    link: mongoose.Types.ObjectId(postId),
                  });
                  await notification.save();

                  const notificationSend = await Notification.aggregate([
                    {
                      $match: {
                        _id: notification._id,
                      },
                    },
                    {
                      $lookup: {
                        from: 'users',
                        localField: 'senderId',
                        foreignField: '_id',
                        as: 'sender',
                      },
                    },
                    {
                      $lookup: {
                        from: 'posts',
                        localField: 'link',
                        foreignField: '_id',
                        as: 'post',
                      },
                    },
                    {
                      $unwind: {
                        path: '$sender',
                        preserveNullAndEmptyArrays: false,
                      },
                    },
                    {
                      $set: {
                        following: {
                          $cond: {
                            if: {
                              $eq: ['$notificationType', 'follow'],
                            },
                            then: {
                              $in: ['$receiverId', '$sender.followers'],
                            },
                            else: '$$REMOVE',
                          },
                        },
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        'sender._id': 1,
                        'sender.username': 1,
                        'sender.pic': 1,
                        notificationType: 1,
                        notificationText: 1,
                        'post._id': 1,
                        'post.photo': 1,
                        following: 1,
                        read: 1,
                        link: 1,
                        createdAt: 1,
                      },
                    },
                  ]);

                  ioNotification.to(user?.socketId).emit('getNotification', {
                    notificationSend,
                  });
                }
              }
            },
          );
          socket.on('disconnect', () => {
            removeGlobalUser(decoded?._id);
          });
        }
      },
    );
  });
  return ioNotification;
};

// Message Socket
const messageSocket = (httpServer, sessionMiddleware) => {
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

  io.on('connection', (socket) => {
    // when user connects
    jwt.verify(
      socket.request.session?.jwtToken,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          console.log('err', err);
        } else {
          // take userId and socketId from user
          socket.on('addUser', async (userId) => {
            if (userId != null) {
              addUser(userId, socket.id);
              const onlineUsersIds = await findOnlinefollowingUsers(userId);
              const usersocket = await getUser(userId);
              io.to(usersocket?.socketId).emit('getUsers', onlineUsersIds);
              const onlineFollowersIds = await findOnlinefollowerUsers(userId);
              onlineFollowersIds?.forEach(async (followerId) => {
                const followersocket = await getUser(followerId);
                io.to(followersocket?.socketId).emit('followerConnected', [
                  userId,
                ]);
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
            const user = await getUser(decoded?._id);
            if (user?.socketId != null) {
              const userId = decoded?._id;
              const onlineFollowersIds = await findOnlinefollowerUsers(userId);
              onlineFollowersIds?.forEach(async (followerId) => {
                const followersocket = await getUser(followerId);
                io.to(followersocket?.socketId).emit('followerDisconnected', [
                  userId,
                ]);
              });
              removeUser(decoded?._id);
            }
          });
        }
      },
    );
  });
  return io;
};
module.exports = { notificationSocket, messageSocket };
