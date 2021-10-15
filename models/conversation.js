const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const conversationSchema = new mongoose.Schema(
  {
    member: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);