var express = require('express');
var router = express.Router();

// Importar rutas de usuario
var userRoutes = require('./userRoutes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Rutas relacionadas con el usuario
router.use('/users', userRoutes);

module.exports = router;
