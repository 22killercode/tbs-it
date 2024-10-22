const mongoose = require('mongoose');
const { Schema } = mongoose;

const messages = new Schema({
    //direccion
    email: { type: String },
    names: { type: String },
    apellido: { type: String },
    pais: { type: String },

    message: { type: String },
    messageCliente: { type: String },
    messageOwner: { type: String },
    subjectCliente: { type: String },
    subjectOwner: { type: String },
    logoOwner: { type: String },
    nombreComercio: { type: String },
    nombreCliente: { type: String },
    idOwner: { type: String },
    idCliente: { type: String },
    codigoPedido: { type: String },

    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('messages', messages)