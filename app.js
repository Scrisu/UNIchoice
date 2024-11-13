require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const { isAuthenticated } = require('./middleware/authmiddleware'); // Correct path to middleware
const setupMiddleware = require('./config/middleware'); // Middleware setup
const authRoutes = require('./routes/authRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const initDb = require('./config/initDb');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

// Import Models
const User = require('./models/User');
const VerificationCode = require('./models/VerificationCode');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Set up Middleware
setupMiddleware(app);

// Use `body-parser` middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use the static middleware to serve static files
// Serve static files from 'public'

// Initialize Database (Sync Models)
initDb();
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Needed if you are using SSL
    }
});

// Set up session management
app.use(
    session({
        store: new pgSession({
            pool: pgPool, // Connection pool
            tableName: 'session' // Defaults to 'session'
        }),
        secret: process.env.SESSION_SECRET || 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookies for production
            maxAge: 1000 * 60 * 10 // Adjust session expiration as needed
        }
    })
);

// Set up Routes
app.use('/', authRoutes);
app.use('/', verificationRoutes);

// Home Page Route (Main Landing Page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'facultati.html')); // Serves the static 'index.html' file from 'public'
});

// Authentication Page Route (Registration and Login Page)
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html')); // Serves the new 'auth.html' file from 'public'
});

app.use(express.static(path.join(__dirname, 'public'))); 

// Verification Page Route
app.get('/verify-email', (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).send('Email is required. <a href="/">Try again</a>');
    }

    // Serve the verification HTML page
    res.sendFile(path.join(__dirname, 'public', 'verify-email.html'));
});

// Verify Code Route
app.post('/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).send('Both email and code are required. <a href="/verify-email?email=' + encodeURIComponent(email) + '">Try again</a>');
        }

        // Step 1: Retrieve the verification record from the database
        const record = await VerificationCode.findOne({ where: { email } });

        // Step 2: Check if the record exists and verify the code
        if (record) {
            console.log(`Verification record found: Code in DB: ${record.code}, Expires at: ${record.expiresAt}`);

            if (record.code.trim() === code.trim() && record.expiresAt > new Date()) {
                console.log(`Code matched and is not expired for email: ${email}`);

                // Step 3: Check if `req.session.tempUser` exists
                if (!req.session.tempUser) {
                    return res.status(400).send('Session expired. Please register again. <a href="/">Register</a>');
                }

                // Step 4: Assign the `tempUser` from the session
                const tempUser = req.session.tempUser;

                // Step 5: Extract email, username, and password with error handling
                const { username, password } = tempUser;

                if (!email || !username || !password) {
                    return res.status(400).send('Session data is incomplete. Please register again. <a href="/">Register</a>');
                }

                // Step 6: Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Step 7: Create a new user record in the database
                const newUser = await User.create({ username, email, password: hashedPassword });

                // Step 8: Set the user in the session and clean up tempUser
                req.session.user = newUser;
                delete req.session.tempUser;

                // Step 9: Redirect to home page
                res.redirect('/home');
            } else {
                if (record.code.trim() !== code.trim()) {
                    console.log(`Verification failed: Entered code does not match the stored code.`);
                } else if (record.expiresAt <= new Date()) {
                    console.log(`Verification failed: Code expired.`);
                }
                res.status(400).send('Invalid or expired verification code. <a href="/verify-email?email=' + encodeURIComponent(email) + '">Try again</a>');
            }
        } else {
            console.log(`No verification record found for email: ${email}`);
            res.status(400).send('Invalid or expired verification code. <a href="/verify-email?email=' + encodeURIComponent(email) + '">Try again</a>');
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send('Failed to verify code');
    }
});

app.get('/facultati', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'facultati.html')); // Serve facultati.html when someone visits /facultati
});

// Home page after successful login or registration
app.get('/home', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Serves the static 'home.html' file from 'public'
});

// Middleware to Prevent Caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
