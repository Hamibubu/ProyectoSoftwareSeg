const { model, Schema } = require('mongoose');

const deliverySchema = new Schema({
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    colonia: { type: String, required: true },
    ciudad: { type: String, required: true },
    estado: { type: String, required: true },
    referencias: { type: String, required: true },
    user_id: {type: String, required: true}
})

module.exports = model('deliveries', deliverySchema);