const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Notification = require('../models/notification');
const { JWT_SECRET } = require('../config/keys');

// Notification Socket
const notificationSocket = (serverUrl) => {
  const ioNotification = socketio(9011, {
    cors: {
      origin: serverUrl,
    },
  });

  let globalOnlineUsers = [];

  // add user to globalOnlineUsers list
  const addGlobalUser = (userId, socketId) => {
    !globalOnlineUsers.some((user) => user.userId === userId) &&
      globalOnlineUsers.push({ userId, socketId });
    console.log(globalOnlineUsers);
  };

  // remove user from globalOnlineUsers list
  const removeGlobalUser = (socketId) => {
    globalOnlineUsers = globalOnlineUsers.filter(
      (user) => user.socketId !== socketId,
    );
    console.log(globalOnlineUsers);
  };

  // get userid of notification receiver
  const getGlobalUser = (userId) => {
    const receiver = globalOnlineUsers.find((user) => user.userId === userId);
    return receiver;
  };

  ioNotification.on('connection', (socket) => {
    jwt.verify(socket.handshake.query.token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('err', err);
      } else {
        console.log(
          'notification socket connected',
          socket.id,
          'online users',
          globalOnlineUsers,
        );
        socket.on('joinNotification', async (userId) => {
          console.log('notification JOIN', userId, socket.id);
          if (userId != null) {
            addGlobalUser(userId, socket.id);
          }
        });
        socket.on(
          'sendNotification',
          async ({ senderId, receiverId, postId, notificationType }) => {
            const user = await getGlobalUser(receiverId);
            console.log(
              'send noti',
              senderId,
              receiverId,
              postId,
              notificationType,
            );
            console.log('user', globalOnlineUsers, user);

            // insert into notification
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
            console.log('notification', notification);

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

            console.log('noti send', notificationSend);
            ioNotification.to(user?.socketId).emit('getNotification', {
              notificationSend,
            });
          },
        );
        socket.on('disconnect', () => {
          console.log('notification socket disconnected', socket.id);
          console.log('online users', globalOnlineUsers);
          removeGlobalUser(socket.id);
        });
      }
    });
  });
  return ioNotification;
};

// Message Socket
const messageSocket = (serverUrl) => {
  const io = socketio(9010, {
    cors: {
      origin: serverUrl,
    },
  });

  let onlineUsers = [];

  // add user to onlineUsers list
  const addUser = (userId, socketId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId });
    console.log(onlineUsers);
    return 0;
  };

  // remove user from onlineUsers list
  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    console.log(onlineUsers);
  };

  // get userid of msg receiver
  const getUser = (userId) => {
    const user = onlineUsers.find((onlineUser) => onlineUser.userId === userId);
    return user;
  };

  const getUserSocket = async (userId) => {
    const user = await onlineUsers.find(
      (onlineUser) => onlineUser.userId == userId,
    );
    return user;
  };

  const getUserIdBySocketId = async (socketId) => {
    const user = await onlineUsers.find(
      (onlineUser) => onlineUser.socketId == socketId,
    );
    return user;
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
    if (followingUsersIds[0]) {
      const onlineFollowingUsersIds = followingUsersIds[0].following.filter(
        (f) => onlineUsers.some((u) => u.userId == f),
      );
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
    if (followerUsersIds[0]) {
      const onlineFollowerUsersIds = followerUsersIds[0].followers.filter((f) =>
        onlineUsers.some((u) => u.userId == f),
      );
      return onlineFollowerUsersIds;
    }
  };

  io.on('connection', (socket) => {
    // when connect
    jwt.verify(socket.handshake.query.token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('err', err);
      } else {
        // take userId and socketId from user
        socket.on('addUser', async (userId) => {
          if (userId != null) {
            addUser(userId, socket.id);
            const onlineUsersIds = await findOnlinefollowingUsers(userId);
            const usersocket = getUser(userId);
            io.to(usersocket?.socketId).emit('getUsers', onlineUsersIds);

            const onlineFollowersIds = await findOnlinefollowerUsers(userId);
            onlineFollowersIds?.forEach(async (followerId) => {
              const followersocket = await getUserSocket(followerId);
              io.to(followersocket?.socketId).emit('followerConnected', [
                userId,
              ]);
            });
          }
        });

        // send and get message
        socket.on('sendMessage', ({ senderId, receiverId, text }) => {
          try {
            const user = getUser(receiverId);
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
          const user = await getUserIdBySocketId(socket.id);
          if (user?.userId != null) {
            const { userId } = user;
            const onlineFollowersIds = await findOnlinefollowerUsers(userId);
            onlineFollowersIds?.forEach(async (followerId) => {
              const followersocket = await getUserSocket(followerId);
              io.to(followersocket?.socketId).emit('followerDisconnected', [
                userId,
              ]);
            });
            removeUser(socket.id);
          }
        });
      }
    });
  });
  return io;
};
module.exports = { notificationSocket, messageSocket };
