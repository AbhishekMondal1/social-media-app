const express = require("express");
const router = express.Router();
const isAuthorized = require("../middleware/isAuthorized");
const { createMessage, getMessage } = require("../controllers/messages");

//add messages
router.post("/", isAuthorized, createMessage);

// get messages
router.get("/:conversationId", isAuthorized, getMessage);

module.exports = router;
