exports.getLeaderboard = (req, res, next)=> {
  res.render('leaderboard');
};

exports.getLogin = (req, res, next)=> {
  res.render('login');
};

exports.getSignup = (req, res, next)=> {
  res.render('signup');
};