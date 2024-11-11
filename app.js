require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes'); // Rutele pentru utilizatori





// Folosește rutele definite
app.use('/api/users', userRoutes);

// Pornire server
const port = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
