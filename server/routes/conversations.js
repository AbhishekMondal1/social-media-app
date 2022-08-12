const express = require('express');
const isAuthorized = require('../middleware/isAuthorized');
const {
  createConversation,
  getAllConversations,
  getConversation,
} = require('../controllers/conversations');

const router = express.Router();

// new conversation
router.post('/', isAuthorized, createConversation);

// get conv of user
router.get('/:userId', isAuthorized, getAllConversations);

// get conv includes two userId
router.get('/find/:firstUserId/:secondUserId', isAuthorized, getConversation);

module.exports = router;
