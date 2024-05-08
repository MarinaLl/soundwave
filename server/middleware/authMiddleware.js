const requireAuth = (req, res, next) => {
    if (req.session.userId) {
      next(); // El usuario está autenticado, permitir acceso
    } else {
      res.redirect('/login'); // Redirigir al usuario a la página de inicio de sesión si no está autenticado
    }
};
  
module.exports = requireAuth;
  