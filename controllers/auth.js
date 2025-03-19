const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
require('dotenv').config();

const User = require('../models/user');
const Leaderboard = require('../models/leaderboard');

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
  const resetRequestMessage = req.session.resetRequest;
  const resetConfirmationMessage = req.session.resetConfirmation; 
  req.session.resetRequest = null;
  req.session.resetConfirmation = null;
  return res.render('auth/login', {
    resetRequestMessage: resetRequestMessage,
    resetConfirmationMessage: resetConfirmationMessage,
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
        subject: 'Welcome to Mind-Rush! 🎉',
        html: `
                <h2>Welcome to Mind-Rush!</h2>
                <p>Hi ${name},</p>
                <p>Congratulations! You've successfully signed up for Mind-Rush. Now you're ready to embark on your brain training journey!</p>
                <p>Log in to your account and start playing right away. We're excited to have you on board!</p>
                <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The Mind-Rush Team.</p>
              `,
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
          return req.session.save(async (err) => {
            console.log(err);

            if (req.session.tempTime) {
              try {
                const leaderboardEntry = new Leaderboard({
                  userId: user._id,
                  time: req.session.tempTime,
                });

                await leaderboardEntry.save();
                req.session.tempTime = null; // Clear stored time
                await req.session.save();
                return res.redirect('/leaderboard'); // Redirect to leaderboard
              } catch (error) {
                console.error(error);
              }
            }
            req.session.loginMessage = `Welcome ${user.name}!`;
            return res.redirect('/');
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
        req.session.resetRequest = 'Password reset link has been sent to your email. Please check your inbox.';
        res.redirect('/login');
        return transporter.sendMail({
          from: 'mind-rush@gmail.com',
          to: req.body.email,
          subject: 'Mind Rush Password Reset',
          text: `Your Mind Rush password reset link: http://localhost:3000/reset-password/${token}`,
          html: `
                  <p>Hello from Mind Rush!</p>
                  <p>You recently requested to reset your password. Click the link below to create a new password:</p>
                  <p><a href="http://localhost:3000/reset-password/${token}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
                  <p>If you didn't request this change, please ignore this email and your password will remain the same.</p>
                  <p>This link will expire in 24 hours.</p>
                  <p>Thank you,<br>The Mind Rush Team</p>
                `,
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
    .then((result) => {
      req.session.resetConfirmation = `${result.name}, your password has been successfully reset.`;
      return res.redirect('/login')
    })
    .catch((err) => console.log(err));
};
