// routes/playlistRoutes.js
const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');
const Song = require('../models/song');

// Ruta para crear una nueva playlist
router.post('/new/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, songs } = req.body;

    // Verificar si los campos requeridos están presentes
    if (!name) {
      return res.status(400).json({ message: 'El nombre es un campo obligatorio.' });
    }

    // Crear una nueva playlist
    const newPlaylist = new Playlist({ name, createdBy: userId, songs });
    await newPlaylist.save();

    res.status(201).json({ message: 'Playlist creada exitosamente.', playlist: newPlaylist });
  } catch (error) {
    console.error('Error al crear la playlist:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para eliminar una canción de una playlist
router.delete('/:playlistId/remove/:songId', async (req, res) => {
    const { playlistId, songId } = req.params;
  
    try {
      // Busca la playlist por su ID
      const playlist = await Playlist.findById(playlistId);
  
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist no encontrada.' });
      }
  
      // Elimina la canción de la playlist
      playlist.songs.pull(songId);
      await playlist.save();
  
      res.status(200).json({ message: 'Canción eliminada de la playlist exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar canción de la playlist:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

router.post('/:playlistId/add-song', async (req, res) => {
    try {
      const { playlistId } = req.params;
      const { songId, name, artist, album, songUrl, addedBy } = req.body;
  
      // Verificar si la canción ya existe en la colección de canciones
      let song = await Song.findOne({ songId });
  
      // Si la canción no existe, crear una nueva canción
      if (!song) {
        song = await Song.create({ songId, name, artist, album, songUrl, addedBy });
      }
  
      // Agregar la canción a la playlist
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
  
      // Verificar si la canción ya está en la playlist
      if (playlist.songs.some(existingSong => existingSong.equals(song._id))) {
        return res.status(400).json({ message: 'Song already exists in the playlist' });
      }
  
      // Agregar la canción a la playlist
      playlist.songs.push(song);
      await playlist.save();
  
      res.status(201).json({ message: 'Song added to playlist successfully' });
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

// Ruta para listar todas las playlists asignadas al usuario de la sesión
router.get('/all/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Asumiendo que el usuario está en req.user

    // Obtener todas las playlists del usuario
    const playlists = await Playlist.find({ createdBy: userId });

    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error al obtener las playlists del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});
  

// Otras rutas relacionadas con las playlists...

module.exports = router;
