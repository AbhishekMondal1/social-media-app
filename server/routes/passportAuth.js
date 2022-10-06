const express = require('express');
const {
  googleAuthenticate,
  googleCallback,
  googleCallbackAuthenticate,
} = require('../controllers/passportAuth');

const router = express.Router();

router.get('/google', googleAuthenticate);

router.get('/google/callback', googleCallbackAuthenticate, googleCallback);

module.exports = router;
