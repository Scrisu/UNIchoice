require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/db'); // Conexiunea la baza de date
const userRoutes = require('./routes/userRoutes'); // Rutele pentru utilizatori

// Middleware pentru parsing-ul JSON
app.use(express.json());

app.use(express.static('public'));

const cors = require('cors');
app.use(cors());


// Conectare la baza de date
sequelize.authenticate()
  .then(() => {
    console.log('Conexiunea la baza de date a fost stabilită cu succes.');
  })
  .catch(err => {
    console.error('Eroare la conectarea la baza de date:', err);
  });

// Sincronizează baza de date
sequelize.sync()
  .then(() => {
    console.log('Baza de date este sincronizată');
  })
  .catch(err => {
    console.error('Eroare la sincronizarea bazei de date:', err);
  });

// Folosește rutele definite
app.use('/api/users', userRoutes);

// Pornire server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serverul rulează la http://localhost:${port}`);
});
