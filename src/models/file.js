const {Schema, model} = require('mongoose');

const fileSchema = new Schema({
    name: {type: String},
    filename: {type: String},
    productId: {type: String}
});

module.exports = model('attachments', fileSchema);