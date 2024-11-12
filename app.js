require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection using Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false, // Allows connection to servers with self-signed certificates
      },
  },
  logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Database connection failed:', err));

// User model definition
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Sync model with the database
(async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Failed to synchronize database:', error);
    }
})();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Use an environment variable for the secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Helps prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Custom Middleware for User Authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized. <a href="/">Log in</a>');
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required. <a href="/">Try again</a>');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.send('Registration successful! <a href="/">Go back</a>');
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send('Username already exists. <a href="/">Try again</a>');
        } else {
            console.error('Registration error:', error);
            res.status(500).send('An error occurred. <a href="/">Try again</a>');
        }
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required. <a href="/">Try again</a>');
        }
        const user = await User.findOne({ where: { username } });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;  // Save user session
            res.send(`Welcome ${username}! <a href="/logout">Log out</a>`);
        } else {
            res.status(401).send('Invalid credentials. <a href="/">Try again</a>');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred. <a href="/">Try again</a>');
    }
});

// Logout Route
app.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('An error occurred. <a href="/">Try again</a>');
        }
        res.send('You have logged out. <a href="/">Go back</a>');
    });
});

// Middleware to prevent caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
