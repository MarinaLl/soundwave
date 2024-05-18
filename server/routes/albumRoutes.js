const express = require('express');
const router = express.Router();
const Album = require('../models/album');
const Artist = require('../models/artist');

// Ruta para crear un nuevo álbum
router.post('/new', async (req, res) => {
  try {
    const { album_type, name, album_id, images, release_date, total_tracks, artists } = req.body;

    // Verificar si los campos requeridos están presentes
    if (!album_type || !name || !album_id || !images || !release_date || total_tracks === undefined || !artists) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el álbum ya existe
    const existingAlbum = await Album.findOne({ album_id });
    if (existingAlbum) {
      return res.status(400).json({ message: 'El álbum ya existe.' });
    }

    const artistIds = [];

    for (const artistData of artists) {
      let artist = await Artist.findOne({ artist_id: artistData.artist_id });

      // Si el artista no existe, crearlo
      if (!artist) {
        artist = new Artist({
          artist_id: artistData.artist_id,
          name: artistData.name,
          genres: artistData.genres,
          images: artistData.images
        });
        await artist.save();
      }

      artistIds.push(artist._id);
    }

    // Crear un nuevo álbum
    const newAlbum = new Album({
      album_type,
      name,
      album_id,
      images,
      release_date,
      total_tracks,
      artists: artistIds
    });
    await newAlbum.save();

    res.status(201).json({ message: 'Álbum creado exitosamente.' });
  } catch (error) {
    console.error('Error al crear el álbum:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
