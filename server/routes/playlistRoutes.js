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
  
      res.status(200).json({ message: 'Song removed successfully from the playlist.' });
    } catch (error) {
      console.error('Error al eliminar canción de la playlist:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

router.post('/add-song', async (req, res) => {
    try {
      const { playlistIds, songId } = req.body;

      // Verificar si la canción ya existe en la colección de canciones
      let song = await Song.findOne({ songId });

      // Procesar cada playlistId
      for (const playlistId of playlistIds) {
          // Encontrar la playlist
          const playlist = await Playlist.findById(playlistId);
          if (!playlist) {
            return res.status(404).json({ message: `Playlist with ID ${playlistId} not found` });
          }

          // Verificar si la canción ya está en la playlist
          if (!playlist.songs.some(existingSong => existingSong.equals(song._id))) {
              // Agregar la canción a la playlist si no existe
              playlist.songs.push(song._id);
              await playlist.save();
          }
      }

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
    const playlists = await Playlist.find({ createdBy: userId })
      .populate({
        path: 'songs',
        populate: {
          path: 'album',
          populate: {
            path: 'artists' // Popula los artistas dentro de los álbumes
          }
        }
      });

    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error al obtener las playlists del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para obtener la información de una playlist específica
router.get('/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Buscar la playlist por su ID y populando las canciones asociadas
    const playlist = await Playlist.findById(playlistId)
      .populate({
        path: 'songs',
        populate: {
          path: 'album',
          populate: {
            path: 'artists' // Popula los artistas dentro de los álbumes
          }
        }
      });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.status(200).json(playlist);
  } catch (error) {
    console.error('Error al obtener la playlist:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para eliminar una playlist
router.delete('/del/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Buscar la playlist por su ID
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Eliminar la playlist
    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Otras rutas relacionadas con las playlists...

module.exports = router;
