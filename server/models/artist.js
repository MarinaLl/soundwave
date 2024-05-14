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

const artistSchema = new Schema({
  artist_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  genres: {
    type: [String],
    required: true
  },
  images: {
    type: [imageSchema],
    required: true
  }
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
