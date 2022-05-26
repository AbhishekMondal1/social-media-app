const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");
const requireLogin = require("../middleware/requireLogin");

// new conversation

router.post("/", requireLogin, async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    try {
        console.log(req.body.senderId)
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
})

//get conv of user

router.get("/:userId", requireLogin, async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
})

//get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", requireLogin, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;

