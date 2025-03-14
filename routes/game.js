const express = require('express');
const router = express.Router();

const gameController = require('../controllers/game');

router.get('/', gameController.getIndex);

router.get('/leaderboard', gameController.getLeaderboard);

router.get('/:gameType', gameController.getGamePage); 

module.exports = router;