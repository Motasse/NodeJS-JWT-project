const express = require('express');
const router = express.Router();
const userModel = require('./userModel');

router.get('/profile', userModel.userProfile);
router.get('/users/:userId', userModel.getInfoById);
router.get('/refreshToken', userModel.getSpecific);

module.exports = router;