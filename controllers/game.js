exports.getIndex = (req, res, next) => {
  res.render('../index');
};

exports.getLeaderboard = (req, res, next) => {
  res.render('leaderboard');
};

// In your gameController
exports.getGamePage = (req, res, next) => {
  const { gameType } = req.params; // Extract gameType from URL parameter
  let gameConfig = {};

  switch (gameType) {
    case 'tic-tac-toe':
      gameConfig = {
        cssFile: 'css/tic-tac-toe.css',
        scriptFile: 'js/ticTacToe.js',
        pageTitle: 'Tic-Tac-Toe Game',
        gameType: 'tic-tac-toe',
        heading: 'Tier 01: Tic-Tac-Toe',
        hintText:
          'Think fast, play smart! Outsmart your opponent before the grid fills up. Every move brings you closer to victory... or defeat!',
        computerResponseInitial:
          'They don’t call me a tic-tac-toe genius for nothing!',
        computerResponseWin: 'That’s just a lucky break, nothing more!',
        computerResponseLose: 'This let down must be studied!',
        svgPathInitial: 'svgs/confidence.svg',
        svgPathWin: 'svgs/fluke.svg',
        svgPathLose: 'svgs/mockery.svg',
        pathWin: '/memory-match',
        pathLose: '/tic-tac-toe',
      };
      break;

    case 'memory-match':
      gameConfig = {
        cssFile: 'css/memory-match.css',
        scriptFile: 'js/memoryMatch.js',
        pageTitle: 'Memory Match',
        gameType: 'memory-match',
        heading: 'Tier 02: Memory Match',
        hintText:
          'Flip, focus, and find the pairs! Every move counts, so keep your memory sharp and match fast before time runs out!',
        computerResponseInitial:
          'Tough luck! Memory games just aren’t your thing right... right?',
        computerResponseWin: 'Huh... even a broken clock is right twice a day.',
        computerResponseLose:
          'You need therapy after this generational downfall!',
        svgPathInitial: 'svgs/dizzy.svg',
        svgPathWin: 'svgs/annoyed.svg',
        svgPathLose: 'svgs/therapy.svg',
        pathWin: '/speed-typing',
        pathLose: '/memory-match',
        gameCards: [
          { name: 'cassette-tape', image: 'icons/cassette_tape.webp' },
          { name: 'game-boy', image: 'icons/game_boy.jpg' },
          { name: 'typewriter', image: 'icons/typewriter.jpg' },
          { name: 'polaroid-camera', image: 'icons/polaroid_camera.webp' },
          { name: 'rotary-phone', image: 'icons/rotary_phone.avif' },
          { name: 'record-player', image: 'icons/record_player.png' },
          { name: 'walkman', image: 'icons/walkman.jpg' },
          { name: 'vhs-tape', image: 'icons/vhs_tape.jpg' },
        ],
      };
      break;

    case 'speed-typing':
      gameConfig = {
        cssFile: 'css/speed-typing.css',
        scriptFile: 'js/speedTyping.js',
        pageTitle: 'Typing Test',
        gameType: 'speed-typing',
        heading: 'Tier 04: Speed Typing',
        hintText:
          'Speed is key! But don’t let your fingers outrun your brain—accuracy matters too. Type like a pro, or prepare for typos!',
        computerResponseInitial:
          'Oh no, not typing!  Sweaty palms already?  it’s just your pride on the line.',
        computerResponseWin:
          'Well, well, look who finally made it!  Guess you’re not as slow as we thought... for now',
        computerResponseLose:
          'Oops! Looks like your fingers were faster than your brain. Better luck next time!',
        svgPathInitial: 'svgs/bipolar.svg',
        svgPathWin: 'svgs/surprise.svg',
        svgPathLose: 'svgs/angry.svg',
        pathWin: '/',
        pathLose: null
      };
      break;

    default:
      return res.status(404).send('Game not found');
  }

  res.render('game', gameConfig);
};
