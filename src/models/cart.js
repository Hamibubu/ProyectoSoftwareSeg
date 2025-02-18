const { model, Schema } = require('mongoose');
const Product = require('./../models/product');


const cartSchema = new Schema({
    id: {type: String, require: true},
    productos:{type:Array, default: []} 
});

// Aqui se pone en model la coleccion de la bd, seguido del usuario
module.exports = model('cart', cartSchema);