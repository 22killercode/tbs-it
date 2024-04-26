const mongoose = require('mongoose');
const { Schema } = mongoose;

const Remitos = new Schema({
    //direccion

    idOwner: { type: String },
    idCliente: { type: String },
    emailCliente: { type: String },
    statusCobro: { type: String },

    date: { type: Date, default: Date.now },
    user: { type: String }
});

module.exports = mongoose.model('Remitos', Remitos)