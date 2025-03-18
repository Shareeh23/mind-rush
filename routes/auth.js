const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

const User = require('../models/user');

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin);

router.get('/logout', authController.getLogout);

router.get('/reset', authController.getReset);

router.get('/reset-password/:token', authController.getResetPassword);

router.post(
  '/signup',
  [
    // Validate username: not empty and at least 5 characters long
    check('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 5 })
      .withMessage('Username must be at least 5 characters long')
      .custom((value, { req }) => {
        return User.findOne({ name: value }).then((user) => {
          if (user) {
            return Promise.reject('Username is already taken!');
          }
        });
      }),

    // Validate email: not empty and a valid email format
    check('email')
      .normalizeEmail()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email'),

    // Validate password: not empty and at least 6 characters long
    check('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .isAlphanumeric()
      .withMessage('Password must contain only letters and numbers'),
  ],
  authController.postSignup
);

router.post('/login', authController.postLogin, [
  check('username').trim(),
  check('password').trim(),
]);

router.post('/reset', authController.postReset);

router.post('/reset-password', authController.postResetPassword);

module.exports = router;
