const express = require('express');

const router = express.Router();

// Ruta pentru înregistrarea utilizatorilor
router.post('/register', registerUser);

// Ruta pentru autentificarea utilizatorilor
router.post('/login', loginUser);

module.exports = router;
