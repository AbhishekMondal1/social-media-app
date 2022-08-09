const express = require("express");
const router = express.Router();
const isAuthorized = require("../middleware/isAuthorized");
const { getAllNotifications } = require("../controllers/notification");

// get all notifications
router.get("/", isAuthorized, getAllNotifications);


module.exports = router;