const express = require('express');
const VerificationCode = require('../models/VerificationCode');
const User = require('../models/User');
const { sendVerificationEmail, generateVerificationCode } = require('../utils/emailService');

const router = express.Router();

// Route for requesting verification code during registration
router.post('/request-verification', async (req, res) => {
    const { email, username, password } = req.body;

    // Generate a new verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Set expiry for 10 minutes from now

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).send('Email is already in use. <a href="/">Try again</a>');
        }

        // Save the verification code in the database
        await VerificationCode.upsert({ email, code, expiresAt });

        // Send verification code via email
        await sendVerificationEmail(email, code);

        // Store temporary user information in session
        req.session.tempUser = { email, username, password };

        console.log(`Verification email sent to ${email} with code ${code}`);
        res.redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error('Error during verification code request:', error.message);
        res.status(500).send('Failed to send verification code. Please try again later.');
    }
});

module.exports = router;