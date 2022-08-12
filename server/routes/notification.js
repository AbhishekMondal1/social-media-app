const express = require('express');
const isAuthorized = require('../middleware/isAuthorized');
const { getAllNotifications } = require('../controllers/notification');

const router = express.Router();

// get all notifications
router.get('/', isAuthorized, getAllNotifications);

// read notification
// router.put(
//   '/:notificationId',
//   isAuthorized,
//   require('../controllers/notification').readNotification,
// );

module.exports = router;
