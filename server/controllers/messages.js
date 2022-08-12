const mongoose = require('mongoose');
const Message = require('../models/message');
const Conversation = require('../models/conversation');

// send messages to a conversation
const createMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  newMessage.sender = mongoose.Types.ObjectId(req.body.sender);
  try {
    const savedMessage = await newMessage.save();
    await Conversation.findByIdAndUpdate(
      mongoose.Types.ObjectId(newMessage.conversationId),
      { $set: { lastMessageTime: savedMessage.createdAt } },
      { new: true },
    );
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get messages of a conversation
const getMessage = async (req, res) => {
  const perPage = 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const pageLimit = page * perPage;
  const skipLimit = perPage * (page - 1);

  try {
    const totalPosts = await Message.aggregate([
      {
        $match: { conversationId: req.params.conversationId },
      },
      {
        $count: 'total',
      },
    ]);
    const totalPages = Math.ceil(totalPosts[0].total / perPage);
    const hasMorePages = page < totalPages;
    const messages = await Message.aggregate([
      {
        $match: {
          conversationId: req.params.conversationId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: pageLimit,
      },
      {
        $skip: skipLimit,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          createdAt: 1,
          conversationId: 1,
          'sender._id': 1,
          'sender.pic': 1,
          'sender.name': 1,
          'sender.username': 1,
        },
      },
    ]);
    res.json({ messages, hasMorePages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

module.exports = {
  createMessage,
  getMessage,
};
