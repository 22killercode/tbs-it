const mongoose = require('mongoose');
const { Schema } = mongoose;

const Tokens = new Schema({
    //direccion
   
    token: { type: String },
    emailBlock: { type: String },
    mailValidado:                   {type:Boolean},
    Email: { type: String },

    date: { type: Date, default: Date.now },
    user: { type: String }
});

module.exports = mongoose.model('Tokens', Tokens)