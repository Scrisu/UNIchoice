const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// Verification model definition for email verification
const VerificationCode = sequelize.define('VerificationCode', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});
module.exports = VerificationCode;