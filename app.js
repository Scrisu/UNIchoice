require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

// Import Middleware, Routes, and Models
const { isAuthenticated } = require('./middleware/authmiddleware'); // Correct path to middleware
const setupMiddleware = require('./config/middleware'); // Middleware setup
const authRoutes = require('./routes/authRoutes'); // Import authRoutes here
const verificationRoutes = require('./routes/verificationRoutes');
const initDb = require('./config/initDb');
const User = require('./models/User');
const VerificationCode = require('./models/VerificationCode');
const chatbotRoutes = require('./routes/chatbotRoutes');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Create PostgreSQL Pool for session storage
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Adjust this setting based on your SSL requirements
    }
});

// Set 'trust proxy' to handle secure cookies correctly behind proxies/load balancers


// Set up Body Parser middleware to parse incoming form data


// Set up Session Management with PostgreSQL Store
app.use(
    session({
        store: new pgSession({
            pool: pgPool, // Use the pool you just created
            tableName: 'session' // Optional: The default is 'session'
        }),
        secret: process.env.SESSION_SECRET || 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 1000 * 60 * 10 // Set cookie lifetime (e.g., 10 minutes)
        }
    })
);



// Middleware setup
setupMiddleware(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('trust proxy', 1);

// Static files middleware to serve files from 'public' directory
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Initialize Database (Sync Models)
initDb();

// Set up Routes
app.use('/', authRoutes); // Use authRoutes once
app.use('/', verificationRoutes); // Use verificationRoutes once
// User status endpoint to check if the user is logged in// User status endpoint to check if the user is logged in
app.get('/user/status', (req, res) => {
    console.log("Session data:", req.session); // Check if session data is being retrieved correctly
    if (req.session.user) {
        res.json({
            loggedIn: true,
            username: req.session.user.username,
        });
    } else {
        res.json({
            loggedIn: false,
        });
    }
});



// Home Page Route (Main Landing Page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Serves the static 'facultati.html' file from 'public'
});

// Authentication Page Route (Registration and Login Page)
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html')); // Serves the new 'auth.html' file from 'public'
});

// Verification Page Route
app.get('/verify-email', (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).send('Email is required. <a href="/">Try again</a>');
    }

    // Serve the verification HTML page
    res.sendFile(path.join(__dirname, 'public', 'verify-email.html'));
});

// Facultati Page Route
app.get('/facultati', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'facultati.html')); // Serve facultati.html when someone visits /facultati
});

// Home page after successful login or registration
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Serves the static 'home.html' file from 'public'
});

app.get('/chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

// Middleware to Prevent Caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});
app.use('/api/chatbot', chatbotRoutes);
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
