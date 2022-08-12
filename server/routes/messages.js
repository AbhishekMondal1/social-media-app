const express = require('express');
const isAuthorized = require('../middleware/isAuthorized');
const { createMessage, getMessage } = require('../controllers/messages');

const router = express.Router();

// send messages to a conversation
router.post('/', isAuthorized, createMessage);

// get messages of a conversation
router.get('/:conversationId', isAuthorized, getMessage);

module.exports = router;
