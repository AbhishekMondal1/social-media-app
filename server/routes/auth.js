const express = require('express');
const {
  signup,
  signin,
  resetPassword,
  setNewPassword,
  logout,
} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/reset-password', resetPassword);

router.post('/new-password', setNewPassword);

router.get('/logout', logout);

module.exports = router;
