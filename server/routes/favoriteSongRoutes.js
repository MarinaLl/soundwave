const express = require('express');
const router = express.Router();
const FavoriteSong = require('../models/favoriteSong');
const Song = require('../models/song');

// Ruta para que un usuario agregue una canción a sus favoritos
router.post('/add', async (req, res) => {
  try {
    const { userId, songId } = req.body;

    // Verificar si ya existe la canción en los favoritos del usuario
    const existingFavorite = await FavoriteSong.findOne({ userId, songId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'La canción ya está en tus favoritos.' });
    }

    // Crear una nueva entrada en los favoritos del usuario
    const newFavorite = new FavoriteSong({ userId, songId });
    await newFavorite.save();

    res.status(201).json({ message: 'Canción agregada a favoritos exitosamente.' });
  } catch (error) {
    console.error('Error al agregar canción a favoritos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para obtener todas las canciones favoritas de un usuario
router.get('/all/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;

      // Buscar todas las canciones favoritas del usuario
      const favoriteSongs = await FavoriteSong.find({ userId });

      // Crear un array para almacenar los datos de las canciones favoritas
      let favoriteSongsData = [];

      // Iterar sobre las canciones favoritas y buscar sus datos completos
      for (const favorite of favoriteSongs) {
          const song = await Song.findOne({ _id: favorite.songId });
          if (song) {
              favoriteSongsData.push(song);
          }
      }

      res.status(200).json(favoriteSongsData);
  } catch (error) {
      console.error('Error al obtener las canciones favoritas:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
