// controllers/verificationController.js
const VerificationCode = require('../models/VerificationCode');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.verifyCode = async (req, res) => {
    try {
        // Extract data from request
        const { email, code } = req.body;

        // Retrieve verification record
        const record = await VerificationCode.findOne({ where: { email } });

        if (record && record.code.trim() === code.trim() && record.expiresAt > new Date()) {
            // Proceed to user creation as in your current code
        } else {
            res.status(400).send('Invalid or expired verification code. <a href="/verify-email?email=' + encodeURIComponent(email) + '">Try again</a>');
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send('Failed to verify code');
    }
};
