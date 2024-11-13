const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const setupMiddleware = (app) => {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24
        }
    }));
};

module.exports = setupMiddleware;