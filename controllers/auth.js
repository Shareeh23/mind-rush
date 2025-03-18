const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
require('dotenv').config();

const User = require('../models/user');

const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'shareeh06@gmail.com',
    pass: 'znilzdovbohllkxi',
  },
});

exports.getLogin = (req, res, next) => {
  return res.render('auth/login', {
    errorMessage: '',
    oldInput: { name: '', password: '' },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  return res.render('auth/signup', {
    errorMessage: null,
    oldInput: { name: '', email: '', password: '' },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      errorMessage: errors.array()[0].msg,
      oldInput: { name: name, email: email, password: password },
      validationErrors: errors.array()[0].path,
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then(() => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'mind-rush@gmail.com',
        subject: 'Signup succeeded!',
        text: 'You have signed into mind-rush website, login to continue...',
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogin = (req, res, next) => {
  const name = req.body.username;
  const password = req.body.password;

  User.findOne({ name: name }).then((user) => {
    if (!user) {
      return res.status(422).render('auth/login', {
        errorMessage: 'Invalid username',
        oldInput: { name: name, password: password },
        validationErrors: [],
      });
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect('/');
          });
        }
        return res.status(422).render('auth/login', {
          errorMessage: 'Password do not match!',
          oldInput: { name: name, password: password },
          validationErrors: [],
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    return res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  return res.render('auth/reset');
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          console.log('No user found');
          return res.redirect('auth/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        return transporter.sendMail({
          from: 'mind-rush@gmail.com', // sender address
          to: req.body.email, // list of receivers
          subject: 'Shareeh from mind-rush', // Subject line
          text: 'Change your password via this link', // plain text body
          html: `Click this http://localhost:3000/reset-password/${token}`, // html body
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getResetPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      return res.render('auth/reset-password', {
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postResetPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => res.redirect('/login'))
    .catch((err) => console.log(err));
};
