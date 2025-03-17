const express = require('express');
const router = express.Router();

const gameController = require('../controllers/game');

router.get('/', gameController.getIndex);

router.get('/leaderboard', gameController.getLeaderboard);

// router.post('/save-leaderboard', gameController.postLeaderboard)

router.get('/:gameType', gameController.getGamePage); 

module.exports = router;