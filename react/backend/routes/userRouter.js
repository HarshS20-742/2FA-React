const express = require('express');
const {registerUser, loginUser, verify2FA, verifyLogin2FA} = require('../controllers/userController');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/verify-2fa').post(verify2FA);
router.route('/verify-login-2fa').post(verifyLogin2FA);

module.exports = router;