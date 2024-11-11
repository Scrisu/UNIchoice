require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',  // Specify your database dialect here, e.g., 'postgres', 'mysql'
    protocol: 'postgres', // Required if using a connection string
    logging: false,       // Optional: Disable logging if you prefer
});

module.exports = sequelize;
