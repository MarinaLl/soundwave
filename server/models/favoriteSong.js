const mongoose = require('mongoose');

// Definir el esquema para las canciones favoritas del usuario
const favoriteSongSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songId: {
    type: String, // Tipo de dato según cómo almacenas las canciones en tu base de datos
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
