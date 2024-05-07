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

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Busca el usuario en la base de datos por nombre de usuario
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(404).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    // Almacena información del usuario en la sesión
    req.session.userId = user._id;

    res.status(200).json({ message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

router.get('/profile', (req, res) => {
  // Verifica si hay una sesión de usuario activa
  if (req.session.userId) {
    // Si hay una sesión de usuario, realiza las acciones necesarias
    res.send('¡Bienvenido a tu perfil!');
  } else {
    // Si no hay una sesión de usuario, redirige al usuario a la página de inicio de sesión
    res.redirect('/login');
  }
});


// Otras rutas relacionadas con el usuario...

module.exports = router;
