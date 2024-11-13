const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/authmiddleware');


// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required. <a href="/">Try again</a>');
        }
        const user = await User.findOne({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/home');
        } else {
            res.status(401).send('Invalid credentials. <a href="/">Try again</a>');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred. <a href="/">Try again</a>');
    }
});

// Logout Route
router.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('An error occurred. <a href="/">Try again</a>');
        }
        res.redirect('/');
    });
});

module.exports = router;
