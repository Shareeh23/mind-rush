const Leaderboard = require('../models/leaderboard');

exports.getIndex = (req, res, next) => {
  const loginMessage = req.session.loginMessage;
  req.session.loginMessage = null;
  const profileImage = req.user ? req.user.image : null;
  return res.render('../index', {
    profileImage: profileImage,
    loginMessage: loginMessage
  });
};

// Function to format time (seconds to hh:mm:ss)
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

exports.getLeaderboard = (req, res, next) => {
  Leaderboard.find()
    .populate('userId', 'name image')
    .sort({ time: 1 })
    .then(entries => {
      const leaders = entries.map(entry => ({
        username: entry.userId ? entry.userId.name : 'Unknown Player',
        formattedTime: formatTime(entry.time),
        image: entry.userId ? entry.userId.image : 'images/random-avatar.avif'
    }));    

      res.render('leaderboard', { 
        topLeaders: leaders.slice(0, 3),  // Top 3 players
        allLeaders: leaders // All players for "View All"
      });
    })
    .catch(err => console.log(err));
};

exports.postLeaderboard = async (req, res, next) => {
  try {
    const time = parseInt(req.body.time, 10);

    if (!req.session.user) {
      // Store time in session before redirecting to login
      req.session.tempTime = time;
      return res.redirect('/login'); // Redirect user to login
    }

    const userId = req.session.user._id; // Get user ID from session

    const leaderboardEntry = new Leaderboard({
      userId: userId,
      time: time,
    });

    await leaderboardEntry.save(); // Save to database
    return res.redirect('/leaderboard'); // Redirect to leaderboard page
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getGamePage = (req, res, next) => {
  const { gameType } = req.params; // Extract gameType from URL parameter
  let gameConfig = {};

  switch (gameType) {
    case 'banana-math':
      gameConfig = {
        cssFile: 'css/banana-math.css',
        scriptFile: 'js/bananaMath.js',
        pageTitle: 'Banana Math',
        gameType: 'banana-math',
        heading: 'Tier 01: Banana Math',
        hintText: `Don't rush, but don't wait! The timer is your friend—answer quickly but think carefully! Every second counts in the Banana Math Challenge. 🍌`,
        computerResponseInitial: 'Big man ting yeah, you know Math G?!',
        computerResponseWin:
          'You think you’re smart bro, wait for the next one yeah!',
        computerResponseLose: 'Bananas are smarter than you right now!',
        svgPathInitial: 'svgs/greeting.svg',
        svgPathWin: 'svgs/rage.svg',
        svgPathLose: 'svgs/shrug.svg',
        pathWin: '/tic-tac-toe',
        pathLose: '/banana-math',
      };
      break;

    case 'tic-tac-toe':
      gameConfig = {
        cssFile: 'css/tic-tac-toe.css',
        scriptFile: 'js/ticTacToe.js',
        pageTitle: 'Tic-Tac-Toe Game',
        gameType: 'tic-tac-toe',
        heading: 'Tier 02: Tic-Tac-Toe',
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
        heading: 'Tier 03: Memory Match',
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
          'Oh no, not typing! Sweaty palms already? It’s just your pride on the line.',
        computerResponseWin:
          'Nice one! You beat the odds! Looks like you are a true champion',
        computerResponseLose:
          'Oops! Looks like your fingers were faster than your brain. Better luck next time!',
        svgPathInitial: 'svgs/bipolar.svg',
        svgPathWin: 'svgs/celebration.svg',
        svgPathLose: 'svgs/angry.svg',
        pathWin: '/leaderboard',
        pathLose: null
      };
      break;

    default:
      return res.redirect('/404');
  }

  return res.render('game', gameConfig);
};
