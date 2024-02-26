const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogs = new Schema({
    //direccion
    pathImg: { type: String },
    rutaSimple: { type: String },
    rutaSimple2: { type: String },
    tamanoImg: { type: Number },
    titulo: { type: String },
    mensaje: { type: String },
    idCliente: { type: String },
    rutaURL: { type: String },

    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('blogs', blogs)