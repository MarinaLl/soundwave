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

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Busca el usuario en la base de datos por nombre de usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    // Comprueba si la contraseña proporcionada coincide con la contraseña almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    // Si el nombre de usuario y la contraseña son válidos, genera un token de autenticación
    const token = jwt.sign({ userId: user._id }, 'secreto', { expiresIn: '1h' });

    // Devuelve el token en la respuesta
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Otras rutas relacionadas con el usuario...

module.exports = router;
