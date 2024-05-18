var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const likeRoutes = require('./routes/favoriteSongRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const cors = require('cors');

var app = express();

// Configuración del middleware CORS para todas las rutas
app.use(cors({
  origin: ['http://localhost:3000', 'https://spotify23.p.rapidapi.com/'], // Permite solicitudes desde el frontend React
  credentials: true // Permite el intercambio de cookies y encabezados de autenticación
}));

// Configuración de las opciones CORS para todas las rutas
app.options('*', cors({
  origin: ['http://localhost:3000', 'https://spotify23.p.rapidapi.com/'], // Permite solicitudes desde el frontend React
  credentials: true // Permite el intercambio de cookies y encabezados de autenticación
}));


app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true,
}));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/soundwave', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conexión exitosa a MongoDB");
}).catch(err => {
  console.error("Error al conectar a MongoDB:", err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRoutes);
app.use('/songs', songRoutes);
app.use('/playlists', playlistRoutes);
app.use('/like', likeRoutes);
app.use('/artists', artistRoutes);
//app.use('/albums', albumRoutes);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
