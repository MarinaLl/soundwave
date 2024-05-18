const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
  songId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  songUrl: {
    type: String,
    required: true
  },
  popularity: {
    type: Number,
    required: true
  },
  track_number: {
    type: Number,
    required: true 
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
