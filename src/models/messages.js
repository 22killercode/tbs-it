const mongoose = require('mongoose');
const { Schema } = mongoose;

const messages = new Schema({
    //direccion
    email: { type: String },
    names: { type: String },
    apellido: { type: String },
    pais: { type: String },
    message: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('messages', messages)