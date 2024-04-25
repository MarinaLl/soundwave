const mongoose = require('mongoose');
const userSchema = require('../schemas/user');

const User = mongoose.model('User', userSchema);

// Imprime el esquema para verificar que se haya importado correctamente
console.log(userSchema);

module.exports = User;
