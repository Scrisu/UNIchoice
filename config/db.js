require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Database connection failed:', err));

module.exports = sequelize;
