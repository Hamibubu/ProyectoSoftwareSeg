const {Schema, model} = require('mongoose');

const contactanosSchema = new Schema({
    nombre: {type: String, require:true},
    correo: {type: String, require:true},
    mensaje: {type: String, require:true}
});

module.exports = model('contactUs', contactanosSchema);