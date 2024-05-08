const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  songId: {
    type: String, // Tipo de dato para el ID de la canción
    required: true,
    unique: true // Para asegurar que cada canción tenga un ID único
  },
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  songUrl: {
    type: String,
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo de usuario para identificar quién agregó la canción
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
