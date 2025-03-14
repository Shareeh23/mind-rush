const express = require('express');
const router = express.Router();

const gameController = require('../controllers/game');

router.get('/', gameController.getIndex);

router.get('/leaderboard', gameController.getLeaderboard);

router.get('/tic-tac-toe', gameController.getTicTacToe);

router.get('/memory-match', gameController.getMemoryMatch);

router.get('/speed-typing', gameController.getSpeedTyping);

module.exports = router;