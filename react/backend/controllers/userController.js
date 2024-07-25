const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({ username, email, password });
    if (user) {
        const secret = speakeasy.generateSecret({ length: 20 });
        user.twoFASecret = secret.base32;
        user.is2FAEnabled = false;
        await user.save();
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            qrCodeUrl
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


const verify2FA = asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    const isVerified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: code
    });

    if (isVerified) {
        user.is2FAEnabled = true;
        await user.save();
        res.json({ success: true });
    } else {
        res.status(400);
        throw new Error('Invalid 2FA code');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        if (user.is2FAEnabled) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                twoFAEnabled: true
            });
        } else {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    } else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
});

const verifyLogin2FA = asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    const isVerified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: code
    });

    if (isVerified) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid 2FA code');
    }
});

module.exports = { registerUser, verify2FA, loginUser, verifyLogin2FA };
