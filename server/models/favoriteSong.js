const mongoose = require('mongoose');

// Definir el esquema para las canciones favoritas del usuario
const favoriteSongSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songId: {
    type: mongoose.Schema.Types.ObjectId, // Cambiamos el tipo de dato a ObjectId para hacer referencia al ID de la canción
    ref: 'Song', // Hacemos referencia al modelo de canción existente
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Crear el modelo de canciones favoritas del usuario
const FavoriteSong = mongoose.model('FavoriteSong', favoriteSongSchema);

module.exports = FavoriteSong;
