const mongoose = require('mongoose');
const { Schema } = mongoose;

const Ecommerce = new Schema({

    pathImg: [{ type: String }], 
    rutaSimpleImg: [{ type: String }],

    rubro: { type: String },
    moneda: { type: String },
    nombreProducto: { type: String },
    descripcion: { type: String },
    cantidad: { type: Number },
    precio: { type: Number },

    idCliente: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ecommerce', Ecommerce)