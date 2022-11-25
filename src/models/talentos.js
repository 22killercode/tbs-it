const mongoose = require('mongoose');
const { Schema } = mongoose;

const talentos = new Schema({

    Nombre        :   {type:String},
    Apellido      :   {type:String},
    NumCel        :   {type:String},
    Email         :   {type:String},
    senority      :   {type:String},
    nivelIngles   :   {type:String},
    MonedaCobro   :   {type:String},
    PaisResi      :   {type:String},
    CiudadResi    :   {type:String},
    Empresa       :   {type:String},
    ModTrab       :   {type:String},
    linke         :   {type:String},
    uploadPath    :   {type:String},
    partner       :   {type:Boolean},
    tipoPartner   :   {type:String},
    portfolio : [],

    date: { type: Date, default: Date.now },
    user: { type: String }
});

module.exports = mongoose.model('talentos', talentos)