require('dotenv').config();
const { Sequelize } = require('sequelize');

// Inițializează conexiunea la baza de date folosind variabilele de mediu
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT, // Acesta va fi "postgres" sau "mysql"
});

module.exports = sequelize;