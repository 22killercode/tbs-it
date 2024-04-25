const mongoose = require('mongoose');
const { Schema } = mongoose;

const Ecommerce = new Schema({
    idOwner: { type: String },
    pathImg: [{ type: String }], 
    rutaSimpleImg: [{ type: String }],
    pathImgs: [{ type: String }],
    empresa: { type: String },
    titulo: { type: String },
    categoria: { type: String },
    rubro: { type: String },
    moneda: { type: String },
    nombreProducto: { type: String },
    descripcion: { type: String },
    cantidad: { type: Number },
    precio: { type: Number },
    rutaURL: { type: String },
    pathImg: { type: String },
    rutaSimple: { type: String },
    nombreEcommerce: { type: String },
    emailDuenoEcommerce: { type: String },
    rutaSimple2: { type: String },

    idCliente: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ecommerce', Ecommerce)