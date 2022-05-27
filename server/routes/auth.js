const express = require('express')
const router = express.Router()
const { signup, signin, resetPassword, setNewPassword } = require("../controllers/auth");

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/reset-password', resetPassword);

router.post('/new-password', setNewPassword);

module.exports = router