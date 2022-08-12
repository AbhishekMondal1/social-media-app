const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Conversation', conversationSchema);
