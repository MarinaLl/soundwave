const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  height: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  }
}, { _id: false });

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
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  songUrl: {
    type: String,
    required: true
  },
  image: {
    type: imageSchema,
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
