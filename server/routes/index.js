var express = require('express');
var router = express.Router();

// Importar rutas de usuario
var userRoutes = require('./userRoutes');
var songRoutes = require('./songRoutes');
var playlistRoutes = require('./playlistRoutes');
var likeRoutes = require('./favoriteSongRoutes');
var artistRoutes = require('./artistRoutes');
var albumRoutes = require('./albumRoutes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Rutas relacionadas con el usuario
router.use('/users', userRoutes);
router.use('/songs', songRoutes);
router.use('/playlists', playlistRoutes);
router.use('/like', likeRoutes);
router.use('/artists', artistRoutes);
//router.use('/albums', albumRoutes);

module.exports = router;
