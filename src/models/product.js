const { model, Schema } = require('mongoose');

const productSchema = new Schema({
    nombre: { type: String, require: true },
    precio: { type: Number, require: true },
    stock: { type: Number, require: true },
    categoria: { type: String, require: true },
    marca: { type: String, require: true },
    genero: { type: String, require: true },
    descripcion: { type: String, require: true},
    tallas:{type:Array, default:[]}
});

// Aqui se pone en model la coleccion de la bd, seguido del usuario
module.exports = model('product', productSchema);