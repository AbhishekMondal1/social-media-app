const Conversation = require("../models/conversation");
const mongoose = require("mongoose");

// create new conversation
const createConversation = async (req, res) => {
    try {
    const oldConversation = await Conversation.findOne({
        members: { $all: [mongoose.Types.ObjectId(req.body.senderId), mongoose.Types.ObjectId(req.body.receiverId)] },
    }) 
    if(oldConversation) {
        return res.status(200).json(oldConversation);
    }
    else{
        const newConversation = new Conversation({
            members: [mongoose.Types.ObjectId(req.body.senderId), mongoose.Types.ObjectId(req.body.receiverId)],
        });
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    }
    } catch (err) {
        res.status(500).json(err);
    }
};

// get all conversations of user
const getAllConversations = async (req, res) => {
    try {
        const conversation = await Conversation.aggregate([
            {
                $match:
                {
                    members: { $in: [mongoose.Types.ObjectId(req.params.userId)] },
                }
            }, {
                $sort: {
                    lastMessageTime: -1,
                }
            }
        ]);
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
};

const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [mongoose.Types.ObjectId(req.params.firstUserId), mongoose.Types.ObjectId(req.params.secondUserId)] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    createConversation,
    getAllConversations,
    getConversation
};