const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const Artist = require('../models/artist');
const Album = require('../models/album');
const User = require('../models/user');

// Ruta para crear una nueva canción
router.post('/new', async (req, res) => {
  try {
    const { songId, name, artist_id, album_id, songUrl, addedBy } = req.body;
    let artistData;

    // Verificar si los campos requeridos están presentes
    if (!songId || !name || !artist_id || !album_id || !songUrl || !addedBy) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el artista existe
    let artist = await Artist.findOne({ artist_id });
    if (!artist) {
      // Si el artista no existe, hacer una solicitud a la API externa
      const url = `https://spotify23.p.rapidapi.com/artists/?ids=${artist_id}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '0a1f50b65emsh31785ca821405a1p14bb6ajsn00a2e45af2ce',
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        // Guardar datos de la petición
        artistData = result.artists[0];
      } catch (error) {
        console.error(error);
      }

      // Guardar el nuevo artista en la base de datos
      artist = new Artist({
        artist_id: artistData.id,
        name: artistData.name,
        genres: artistData.genres,
        images: artistData.images
      });
      await artist.save();
    }

    // Verificar si el álbum existe
    let album = await Album.findOne({ album_id });
    if (!album) {
      let albumData;

      const url = `https://spotify23.p.rapidapi.com/albums/?ids=${album_id}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '0a1f50b65emsh31785ca821405a1p14bb6ajsn00a2e45af2ce',
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        albumData = result.albums[0];
      } catch (error) {
        console.error(error);
      }

      // Guardar el nuevo álbum en la base de datos
      album = new Album({
        album_id: albumData.id,
        name: albumData.name,
        album_type: albumData.album_type,
        images: albumData.images,
        release_date: albumData.release_date,
        total_tracks: albumData.total_tracks,
        artist: artist._id // Referenciar al artista recién creado o encontrado
      });
      await album.save();
    }

    // Verificar si el usuario que agrega la canción existe
    let user = await User.findById(addedBy);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Crear una nueva canción
    const newSong = new Song({
      songId,
      name,
      artist: artist._id,
      album: album._id,
      songUrl,
      addedBy: user._id
    });
    await newSong.save();

    res.status(201).json({ message: 'Canción creada exitosamente.' });
  } catch (error) {
    console.error('Error al crear la canción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
