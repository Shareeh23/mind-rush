const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

const User = require('../models/user');

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin);

router.get('/profile', authController.getProfile)

router.get('/logout', authController.getLogout);

router.get('/reset', authController.getReset);

router.get('/reset-password/:token', authController.getResetPassword);

router.post(
  '/signup',
  [
    check('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 5, max: 15 })
      .withMessage('Username must be between 5 - 15 characters long')
      .custom((value, { req }) => {
        return User.findOne({ name: value }).then((user) => {
          if (user) {
            return Promise.reject('Username is already taken!');
          }
        });
      }),

    check('email')
      .normalizeEmail()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email'),

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
  check('username').trim().notEmpty().withMessage('Username is required'),
  check('password').trim().notEmpty().withMessage('Password is required'),
]);

router.post('/profile', [
  check('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 5, max: 15 })
    .withMessage('Username must be between 5 - 15 characters long'),

  check('email')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),

  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .isAlphanumeric()
    .withMessage('Password must contain only letters and numbers'),
],
authController.postProfile);

router.post('/delete-profile', authController.postDeleteProfile);

router.post('/reset', authController.postReset);

router.post('/reset-password', authController.postResetPassword);

module.exports = router;
