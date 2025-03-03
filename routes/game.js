const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('../index');
});

router.get('/tic-tac-toe', (req, res, next) => {
  res.render('tic-tac-toe', {
    path: 'tic-tac-toe',
    cssFile: 'css/tic-tac-toe.css', 
    scriptFile: 'js/ticTacToe.js',
    pageTitle: 'Tic-Tac-Toe Game',
    heading: 'Tier 01 - Analytical Game',
    hintText: 'Think fast, play smart! Outsmart your opponent before the grid fills up. Every move brings you closer to victory… or defeat!',
    computerResponse: 'They don’t call me a tic-tac-toe genius for nothing!',
    svgPath: 'svgs/confidence.svg' 
  });
});

router.get('/memory-match', (req, res, next) => {
  res.render('memory-match', {
    path: 'memory-match',  
    cssFile: 'css/memory-match.css',  
    scriptFile: 'js/memoryMatch.js',
    pageTitle: 'Memory Game',
    heading: 'Tier 02 - Memory Game',
    hintText: 'Flip, focus, and find the pairs! Every move counts, so keep your memory sharp and match fast before time runs out!',
    computerResponse: 'Tough luck! Memory games just aren’t your thing right?',
    svgPath: 'svgs/dizzy.svg' 
  });
});

router.get('/speed-typing', (req, res, next) => {
  res.render('speed-typing', {
    path: 'speed-typing',  
    cssFile: 'css/speed-typing.css',  
    scriptFile: 'js/speedTyping.js',
    pageTitle: 'Reaction Game',
    heading: 'Tier 03 - Reaction Game',
    hintText: 'Speed is key! But don’t let your fingers outrun your brain—accuracy matters too. Type like a pro, or prepare for typos!',
    computerResponse: 'Oh no, not typing!  Sweaty palms already?  it’s just your pride on the line.',
    svgPath: 'svgs/bipolar.svg' 
  });
});

module.exports = router;