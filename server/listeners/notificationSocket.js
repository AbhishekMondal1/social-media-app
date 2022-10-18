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

  // create and save notification in db
  const createNotification = async (
    senderId,
    receiverId,
    postId,
    notificationType,
  ) => {
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
    return notification._id;
  };

  // notification data to be sent to client
  const getNotificationData = async (notificationId) => {
    const notificationData = await Notification.aggregate([
      {
        $match: {
          _id: notificationId,
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
    return notificationData[0];
  };

  // socket events for notification
  const notificationSocketEvents = (socket, decoded) => {
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
            const notificationId = await createNotification(
              senderId,
              receiverId,
              postId,
              notificationType,
            );
            const user = await getGlobalUser(receiverId);
            const notificationData = await getNotificationData(notificationId);

            ioNotification.to(user?.socketId).emit('getNotification', {
              notificationData,
            });
          }
        }
      },
    );
    socket.on('disconnect', () => {
      removeGlobalUser(
        decoded ? decoded?._id : socket.request.session.passport.user._id,
      );
    });
  };

  // establish notification socket connection
  ioNotification.on('connection', (socket) => {
    if (!socket.request.session.passport && socket.request.session.jwtToken) {
      jwt.verify(
        socket.request.session?.jwtToken,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            console.log('err', err);
          } else {
            notificationSocketEvents(socket, decoded);
          }
        },
      );
    } else if (socket.request.session.passport) {
      notificationSocketEvents(socket);
    }
  });

  return ioNotification;
};

module.exports = { notificationSocket };
