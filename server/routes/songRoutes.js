const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const Artist = require('../models/artist');
const Album = require('../models/album');
const User = require('../models/user');
const AlbumRouter = require('./albumRoutes'); // Importa el router de álbumes

// Ruta para crear una nueva canción
router.post('/new', async (req, res) => {
  try {
    const { songId, name, album, songUrl, addedBy, popularity, track_number } = req.body;

    // Verificar si los campos requeridos están presentes
    // if (!songId || !name || !album || !songUrl || !addedBy || popularity === undefined || track_number === undefined) {
    //   return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    // }

    // Verificar si el usuario que agrega la canción existe
    let user = await User.findById(addedBy);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Crear o encontrar el álbum y obtener su ID
    const albumId = await AlbumRouter.createAlbum(album);

    // Crear una nueva canción
    const newSong = new Song({
      songId,
      name,
      songUrl,
      addedBy: user._id,
      popularity,
      track_number,
      album: albumId
    });
    await newSong.save();

    res.status(201).json({ message: 'Canción creada exitosamente.' });
  } catch (error) {
    console.error('Error al crear la canción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Nueva ruta para verificar si una canción ya existe
router.get('/exists/:songId', async (req, res) => {
  try {
    const { songId } = req.params;

    // Verificar si la canción ya existe
    const existingSong = await Song.findOne({ songId });
    if (existingSong) {
      return res.status(200).json({ exists: true, message: 'La canción ya existe.' });
    } else {
      return res.status(200).json({ exists: false, message: 'La canción no existe.' });
    }
  } catch (error) {
    console.error('Error al verificar la canción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para obtener todos los datos de una canción
router.get('/:songId', async (req, res) => {
  try {
    const { songId } = req.params;

    // Buscar la canción por su ID
    const song = await Song.findOne({ songId: songId }).populate({
      path: 'album',
      populate: {
        path: 'artists',
        model: 'Artist'
      }
    }).populate('addedBy', 'username');

    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrada.' });
    }

    res.status(200).json({ song });
  } catch (error) {
    console.error('Error al obtener los datos de la canción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
