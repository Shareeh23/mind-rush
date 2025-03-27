exports.get404 = (req, res, next) => {
  return res.render('404');
}

exports.get500 = (req, res, next) => {
  return res.render('500');
}