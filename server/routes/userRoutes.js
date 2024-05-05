const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Comprueba si ya existe un usuario con el mismo nombre de usuario o correo electrónico
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario o correo electrónico ya está en uso.' });
    }

    // Crea un nuevo usuario
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Otras rutas relacionadas con el usuario...

module.exports = router;
