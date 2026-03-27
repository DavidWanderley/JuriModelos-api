const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginSlowDown, loginRateLimit } = require('../middlewares/loginProtection');

router.post('/register', authController.register);

router.post('/login', loginSlowDown, loginRateLimit, authController.login);

router.post('/forgot-password', loginRateLimit, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;