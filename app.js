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
    await sequelize.sync();
})();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.send('Registration successful! <a href="/">Go back</a>');
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.send('Username already exists. <a href="/">Try again</a>');
        } else {
            res.send('An error occurred. <a href="/">Try again</a>');
        }
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;  // Save user session
            res.send(`Welcome ${username}! <a href="/logout">Log out</a>`);
        } else {
            res.send('Invalid credentials. <a href="/">Try again</a>');
        }
    } catch (error) {
        res.send('An error occurred. <a href="/">Try again</a>');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('You have logged out. <a href="/">Go back</a>');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
