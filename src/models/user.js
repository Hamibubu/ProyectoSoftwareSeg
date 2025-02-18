const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    nombre: { type: String, require: true },
    apellido: { type: String, require: true },
    correo: { type: String, require: true },
    telefono: { type: String },
    contraseña: { type: String, require: true },
    rol: { type: String, default: 'user'}
});

// Aqui se pone en model la coleccion de la bd, seguido del usuario
module.exports = model('user', userSchema);