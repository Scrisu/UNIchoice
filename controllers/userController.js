const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Funcția pentru înregistrarea unui utilizator
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verifică dacă utilizatorul există deja
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Un utilizator cu acest email există deja.' });
    }

    // Criptează parola înainte de a salva în baza de date
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creează un nou utilizator cu parola criptată
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Trimite răspuns cu datele utilizatorului (fără parolă)
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Funcția pentru autentificarea unui utilizator existent
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifică dacă utilizatorul există
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Utilizatorul nu a fost găsit.' });
    }

    // Compară parola primită cu cea din baza de date
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Parola este incorectă.' });
    }

    // Generare token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Trimite răspunsul cu tokenul generat
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exportă funcțiile
module.exports = {
  registerUser, // Asigură-te că aceasta este scrisă corect și definită anterior
  loginUser,    // Asigură-te că funcția loginUser este și ea definită și exportată corect
};
