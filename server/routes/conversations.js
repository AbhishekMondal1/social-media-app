const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const { createConversation, getAllConversations, getConversation} = require("../controllers/conversations");

// new conversation
//
router.post("/", requireLogin, createConversation);

//get conv of user
//
router.get("/:userId", requireLogin, getAllConversations);

//get conv includes two userId
//
router.get("/find/:firstUserId/:secondUserId", requireLogin, getConversation);

module.exports = router;