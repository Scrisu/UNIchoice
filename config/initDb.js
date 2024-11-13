const sequelize = require('./db');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');

const initDb = async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Failed to synchronize database:', error);
    }
};

module.exports = initDb;
