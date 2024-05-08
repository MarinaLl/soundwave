const express = require('express');
const router = express.Router();
const Song = require('../models/song');

// Ruta para crear una nueva canción
router.post('/new', async (req, res) => {
  try {
    const { songId, name, artist, album, songUrl, addedBy } = req.body;

    // Crear una nueva instancia de la canción
    const newSong = new Song({
      songId,
      name,
      artist,
      album,
      songUrl,
      addedBy
    });

    // Guardar la canción en la base de datos
    const savedSong = await newSong.save();

    res.status(201).json(savedSong); // Respondemos con la canción creada
  } catch (error) {
    console.error('Error al crear la canción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
