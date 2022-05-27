const express = require("express");
const router = express.Router();
const requireLogin= require("../middleware/requireLogin"); 
const {createMessage, getMessage} = require("../controllers/messages");

//add messages
//
router.post("/", requireLogin, createMessage);

// get messages
//
router.get("/:conversationId", requireLogin, getMessage);

module.exports = router;
