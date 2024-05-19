const express = require('express');
const router = express.Router();
const FavoriteSong = require('../models/favoriteSong');
const Song = require('../models/song');

// Ruta para obtener todas las canciones favoritas de un usuario
router.get('/all/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;

      // Buscar todas las canciones favoritas del usuario
      const favoriteSongs = await FavoriteSong.find({ userId }).populate({
          path: 'songId',
          populate: {
              path: 'album',
              populate: {
                  path: 'artists'
              }
          }
      });

      // Crear un array para almacenar los datos de las canciones favoritas
      let favoriteSongsData = [];

      // Iterar sobre las canciones favoritas y extraer sus datos completos
      for (const favorite of favoriteSongs) {
          const song = favorite.songId;
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

// Ruta para que un usuario agregue una canción a sus favoritos
router.post('/add', async (req, res) => {
  try {
    const { userId, songId } = req.body;

    // Buscar el song correspondiente al songId
    const song = await Song.findOne({songId: songId });

    console.log(song)

    if (!song) {
      // Si no se encuentra el song, puedes devolver un error
      return res.status(404).json({ message: 'La canción no existe.' });
    }

    // Crear una nueva entrada en los favoritos del usuario
    const newFavorite = new FavoriteSong({ userId, songId: song._id });
    await newFavorite.save();

    res.status(201).json({ message: 'Canción agregada a favoritos exitosamente.' });
  } catch (error) {
    console.error('Error al agregar canción a favoritos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para que un usuario elimina una canción de sus favoritos
router.delete('/remove/:userId/:songId', async (req, res) => {
  try {
    const { userId, songId } = req.params;

    const song = await Song.findOne({songId: songId });

    // Buscar la canción favorita del usuario
    const favoriteSong = await FavoriteSong.findOneAndDelete({ userId, songId: song._id });

    if (!favoriteSong) {
      return res.status(404).json({ message: 'La canción no está en tus favoritos.' });
    }

    res.status(200).json({ message: 'Canción eliminada de favoritos exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la canción de favoritos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para comporbar si la cancion esta en la lista de favoritos
router.get('/check/:userId/:songId', async (req, res) => {
  try {
    const { userId, songId } = req.params;

    const song = await Song.findOne({songId: songId });

    // Verificar si existe la canción en los favoritos del usuario
    const favoriteSong = await FavoriteSong.findOne({ userId, songId: song._id });

    if (favoriteSong) {
      res.status(200).json({ isFavorite: true });
    } else {
      res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    console.error('Error al verificar la canción en favoritos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});




module.exports = router;
