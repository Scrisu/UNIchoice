const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const { sendVerificationEmail, generateVerificationCode } = require('../utils/emailService');
const { isAuthenticated } = require('../middleware/authmiddleware');
const Sequelize = require('sequelize');

// Registration Route - Step 1: Validate and Send Verification Code
// Registration Route - Step 1: Validate and Send Verification Code
// Registration Route - Step 1: Validate and Send Verification Code



// Login Route
// Login Route
// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        
        // Find the user in the database
        const user = await User.findOne({ where: { email } });

        // Compare password
        if (user && await bcrypt.compare(password, user.password)) {
            // Store minimal user information in the session
            req.session.user = {
                id: user.id,
                username: user.username,
            };
            res.json({ loggedIn: true, message: 'Login successful', username: user.username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});



// Logout Route
// Logout Route
router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'An error occurred during logout.' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});


module.exports = router;
