const express = require('express');
const isAuthorized = require('../middleware/isAuthorized');
const {
  getAllNotifications,
  readNotification,
} = require('../controllers/notification');

const router = express.Router();

// get all notifications
router.get('/', isAuthorized, getAllNotifications);

// read notification
router.put('/:notificationId', isAuthorized, readNotification);

module.exports = router;
