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

const albumSchema = new Schema({
  album_type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  album_id: {
    type: String,
    required: true,
    unique: true
  },
  images: {
    type: [imageSchema],
    required: true
  },
  release_date: {
    type: String,
    required: true
  },
  total_tracks: {
    type: Number,
    required: true
  },
  artists: [{
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  }]
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
