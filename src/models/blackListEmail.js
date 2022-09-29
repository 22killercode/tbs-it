const mongoose = require('mongoose');
const { Schema } = mongoose;

const blackListEmail = new Schema({
    //direccion
   
    sebastian: { type: String },
    emailBlock: { type: String },

    date: { type: Date, default: Date.now },
    user: { type: String }
});

module.exports = mongoose.model('blackListEmail', blackListEmail)