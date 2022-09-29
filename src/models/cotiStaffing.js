const mongoose = require('mongoose');
const { Schema } = mongoose;

const cotiStaffing = new Schema({
    Nombre:   {type:String},
    Apellido: {type:String},
    NumCel:   {type:String},
    Email:    {type:String},
    Empresa:  {type:String},
    tecno:    {type:String},
    senority: {type:String},
    Cantmeses:{type:String},
    Idioma:   {type:String},
    Moneda:   {type:String},
    Pais:     {type:String},
    Ciudad:   {type:String},
    PagWeb:   {type:String},
    fullStack1:   {type:String},
    Precio:   {type:Number},
    PrecioFinalHora:   {type:Number},
    cantTotalHoras:   {type:Number},
    date:     { type: Date, default: Date.now },
    user:     { type: String }
});

module.exports = mongoose.model('cotiStaffing', cotiStaffing)