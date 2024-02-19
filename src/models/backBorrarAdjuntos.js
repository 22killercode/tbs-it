const mongoose = require('mongoose');
const { Schema } = mongoose;

const borrarAdjuntos = new Schema({
    //direccion

    Name: { type: String },
    mail: { type: String },
    mailCli: { type: String },

    date: { type: Date, default: Date.now },
    user: { type: String }
});

module.exports = mongoose.model('borrarAdjuntos', borrarAdjuntos)