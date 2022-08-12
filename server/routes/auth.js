const express = require('express');
const {
  signup,
  signin,
  resetPassword,
  setNewPassword,
} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/reset-password', resetPassword);

router.post('/new-password', setNewPassword);

module.exports = router;
