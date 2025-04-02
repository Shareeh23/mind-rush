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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  
  },
});

exports.getLogin = (req, res, next) => {
  const resetRequestMessage = req.session.resetRequest;
  const resetConfirmationMessage = req.session.resetConfirmation;
  req.session.resetRequest = null;
  req.session.resetConfirmation = null;
  return res.render('auth/login', {
    cssFile01: 'css/login.css',
    cssFile02: null,
    scriptFile: null,
    pageTitle: 'Login - Mind-Rush',
    resetRequestMessage: resetRequestMessage,
    resetConfirmationMessage: resetConfirmationMessage,
    errorMessage: '',
    validationErrors: [],
    oldInput: { name: '', password: '' },
  });
};

exports.getSignup = (req, res, next) => {
  return res.render('auth/signup', {
    cssFile01: 'css/signup.css',
    cssFile02: null,
    scriptFile: null,
    pageTitle: 'Sign Up - Mind-Rush',
    errorMessage: null,
    oldInput: { name: '', email: '', password: '' },
    validationErrors: [],
  });
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    return res.redirect('/');
  });
};

exports.getProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findOne({ _id: userId })
    .then((user) => {
      res.render('auth/profile', {
        cssFile01: 'css/profile.css',
        cssFile02: null,
        scriptFile: null,
        pageTitle: 'User Profile - Mind-Rush',
        user: user,
        errorMessage: null,
        oldInput: { name: '', email: '', password: '' },
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/login');
    });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const image = req.file;
  const errors = validationResult(req);

  console.log(image);

  if (!image) {
    return res.status(422).render('auth/signup', {
      cssFile01: 'css/signup.css',
      cssFile02: null,
      scriptFile: null,
      pageTitle: 'Sign Up - Mind-Rush',
      errorMessage: 'Attached file is not an image',
      oldInput: { name: name, email: email, password: password },
      validationErrors: [],
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      cssFile01: 'css/signup.css',
      cssFile02: null,
      scriptFile: null,
      pageTitle: 'Sign Up - Mind-Rush',
      errorMessage: errors.array()[0].msg,
      oldInput: { name: name, email: email, password: password },
      validationErrors: errors.array()[0].path,
    });
  }

  const imagePath = image.path;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        image: imagePath,
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      cssFile01: 'css/login.css',
      cssFile02: null,
      scriptFile: null,
      pageTitle: 'Login - Mind-Rush',
      resetRequestMessage: null,
      resetConfirmationMessage: null,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()[0].path,
      oldInput: { name: name, password: password },
    });
  }

  User.findOne({ name: name }).then((user) => {
    if (!user) {
      return res.status(422).render('auth/login', {
        cssFile01: 'css/login.css',
        cssFile02: null,
        scriptFile: null,
        pageTitle: 'Login - Mind-Rush',
        resetRequestMessage: null,
        resetConfirmationMessage: null,
        errorMessage: 'Invalid username',
        validationErrors: null,
        oldInput: { name: name, password: password },
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
          cssFile01: 'css/login.css',
          cssFile02: null,
          scriptFile: null,
          pageTitle: 'Login - Mind-Rush',
          resetRequestMessage: null,
          resetConfirmationMessage: null,
          errorMessage: 'Password do not match!',
          validationErrors: null,
          oldInput: { name: name, password: password },
        });
      })
      .catch((err) => {
        console.error('Error comparing passwords:', err);
        return res.redirect('/login');
      });
  });
};

exports.postProfile = (req, res, next) => {
  const userId = req.user._id;
  const updatedName = req.body.username;
  const updatedEmail = req.body.email;
  const updatedPassword = req.body.password;
  const updatedImage = req.file
    ? req.file.path.replace('\\', '/')
    : req.user.image;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/profile', {
      cssFile01: 'css/profile.css',
      cssFile02: null,
      scriptFile: null,
      pageTitle: 'User Profile - Mind-Rush',
      user: req.user,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()[0].path,
      oldInput: {
        name: updatedName,
        email: updatedEmail,
        password: updatedPassword,
        image: updatedImage,
      },
    });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }
      user.name = updatedName;
      user.email = updatedEmail;
      user.image = updatedImage;
      return bcrypt.hash(updatedPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        return user.save();
      });
    })
    .then(() => {
      return User.findById(userId); // Fetch updated user
    })
    .then((updatedUser) => {
      res.render('auth/profile', {
        cssFile01: 'css/profile.css',
        cssFile02: null,
        scriptFile: null,
        pageTitle: 'User Profile - Mind-Rush',
        user: updatedUser,
        errorMessage: null,
        oldInput: { name: '', email: '', password: '' },
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/profile');
    });
};

exports.postDeleteProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      const userEmail = user.email;
      const userName = user.name;
      return transporter
        .sendMail({
          to: userEmail,
          from: 'mind-rush@gmail.com',
          subject: 'Account Deleted - Mind-Rush',
          html: `
          <h2>Your Mind-Rush Account Has Been Deleted</h2>
          <p>Hi ${userName},</p>
          <p>We're sorry to see you go! Your account has been successfully deleted from Mind-Rush.</p>
          <p>If this was a mistake or you’d like to return, you can always create a new account and start again.</p>
          <p>If you have any feedback or concerns, please feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Mind-Rush Team.</p>
        `,
        })
        .then(() => ({ userId }));
    })
    .then(({ userId }) => {
      return User.deleteOne({ _id: userId });
    })
    .then(() => {
      req.session.destroy(() => {
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
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
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        req.session.resetRequest =
          'Password reset link has been sent to your email. Please check your inbox.';
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
        cssFile01: 'css/login.css',
        cssFile02: null,
        scriptFile: null,
        pageTitle: 'Reset Password - Mind-Rush',
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
      return res.redirect('/login');
    })
    .catch((err) => console.log(err));
};
