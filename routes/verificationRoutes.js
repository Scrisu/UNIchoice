const express = require('express');
const VerificationCode = require('../models/VerificationCode');
const User = require('../models/User');
const { sendVerificationEmail, generateVerificationCode } = require('../utils/emailService');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const router = express.Router();

// Route for requesting verification code during registration
router.post('/request-verification', async (req, res) => {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('All fields are required. <a href="/auth">Try again</a>');
    }

    try {
        // Step 1: Check if the username or email already exists
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            // If the username or email already exists, return immediately with an error
            return res.status(409).send('Username or Email already exists. Please choose a different one. <a href="/auth">Try again</a>');
        }

        // Step 2: Generate a new verification code
        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Set expiry for 10 minutes from now

        // Step 3: Save the verification code in the database
        await VerificationCode.upsert({ email, code, expiresAt });

        // Step 4: Send verification code via email
        await sendVerificationEmail(email, code);

        // Step 5: Store temporary user information in session
        req.session.tempUser = { email, username, password };

        console.log(`Verification email sent to ${email} with code ${code}`);
        
        // Redirect to the verification page
        res.redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error('Error during verification code request:', error.message);
        res.status(500).send('Failed to send verification code. Please try again later.');
    }
});

// Verify Code Route - Step 2: Verify Code and Create User
router.post('/verify-email', async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).send('Both email and code are required. <a href="/verify-email?email=' + encodeURIComponent(email) + '">Try again</a>');
        }

        // Step 1: Retrieve the verification record from the database
        const record = await VerificationCode.findOne({ where: { email } });

        if (record && record.code.trim() === code.trim() && record.expiresAt > new Date()) {
            console.log(`Code matched and is not expired for email: ${email}`);

            // Step 2: Check if `req.session.tempUser` exists
            if (!req.session.tempUser) {
                return res.status(400).send('Session expired. Please register again. <a href="/auth">Register</a>');
            }

            // Step 3: Extract email, username, and password with error handling
            const tempUser = req.session.tempUser;
            const { username, password } = tempUser;

            if (!username || !email || !password) {
                return res.status(400).send('Session data is incomplete. Please register again. <a href="/auth">Register</a>');
            }

            // Step 4: Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Step 5: Create a new user record in the database
            const newUser = await User.create({ username, email, password: hashedPassword });

            // Step 6: Set the user in the session and clean up tempUser
            req.session.user = newUser;
            delete req.session.tempUser;

            // Step 7: Redirect to home page
            res.redirect('/home');
        } else {
            if (record && record.code.trim() !== code.trim()) {
                console.log(`Verification failed: Entered code does not match the stored code.`);
            } else if (record && record.expiresAt <= new Date()) {
                console.log(`Verification failed: Code expired.`);
            } else {
                console.log(`No verification record found for email: ${email}`);
            }
            res.status(400).send('Invalid or expired verification code. <a href="/verify-email?email=' + encodeURIComponent(email) + '">Try again</a>');
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send('Failed to verify code');
    }
});

module.exports = router;
