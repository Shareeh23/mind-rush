const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/leaderboard', userController.getLeaderboard);

router.get('/signup', userController.getSignup);

router.get('/login', userController.getLogin);

module.exports = router;