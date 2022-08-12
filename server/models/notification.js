const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: ObjectId,
      ref: 'User',
    },
    notificationType: {
      type: String,
      enum: ['follow', 'like', 'comment', 'mention'],
    },
    notificationText: String,
    read: {
      type: Boolean,
      default: false,
    },
    link: ObjectId,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Notification', notificationSchema);
