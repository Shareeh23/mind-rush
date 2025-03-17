const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin);

router.get('/logout', authController.getLogout);

router.get('/reset', authController.getReset);

router.get('/reset-password', authController.getResetPassword);

router.post('/signup', authController.postSignup);

router.post('/login', authController.postLogin);

router.post('/reset', authController.postReset);

router.post('/reset/:token', authController.postResetPassword);

module.exports = router;

