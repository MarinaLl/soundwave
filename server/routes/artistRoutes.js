const express = require('express');
const router = express.Router();
const Artist = require('../models/artist');

// Ruta para crear un nuevo artista
router.post('/new', async (req, res) => {
  try {
    const { artist_id, name, genres, images } = req.body;

    // Verificar si los campos requeridos están presentes
    if (!artist_id || !name || !genres || !images) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Crear un nuevo artista
    const newArtist = new Artist({ artist_id, name, genres, images });
    await newArtist.save();

    res.status(201).json({ message: 'Artista creado exitosamente.' });
  } catch (error) {
    console.error('Error al crear el artista:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
