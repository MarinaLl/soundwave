const express = require('express');
const router = express.Router();
const Album = require('../models/album');
const Artist = require('../models/artist');

// Función para crear un nuevo álbum
async function createAlbum(albumData) {
  try {
    console.log('albumData:', JSON.stringify(albumData, null, 2));
    const { album_type, name, images, release_date, total_tracks, artists } = albumData;

    const album_id = albumData.albumId;
    // Verificar si el álbum ya existe
    const existingAlbum = await Album.findOne({ album_id });
    if (existingAlbum) {
      console.log('El álbum ya existe.');
      return existingAlbum._id;
    }

    const artistIds = [];

    for (const artistData of albumData.artists) {
      let artist = await Artist.findOne({ artist_id: artistData.artistId });
      // Si el artista no existe, crearlo
      if (!artist) {
        artist = new Artist({
          artist_id: artistData.artistId,
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
      album_type: albumData.album_type,
      name: albumData.name,
      album_id: albumData.albumId,
      images: albumData.images,
      release_date: albumData.release_date,
      total_tracks: albumData.total_tracks,
      artists: artistIds
    });
    await newAlbum.save();

    console.log('Álbum creado exitosamente.');
    return newAlbum._id;
  } catch (error) {
    console.error('Error al crear el álbum:', error);
    throw error;
  }
}

module.exports = {
  createAlbum
};
