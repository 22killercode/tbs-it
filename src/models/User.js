const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    // tipos de clientes
    tipoCliente: { type: String },
    pagWeb: { type: Boolean },
    pruductos: { type: Boolean },
    blog: { type: Boolean },
    staffing: { type: Boolean },
    Ecommerce: { type: Boolean },
    Clave: { type: Boolean },
    Blogs: [ ],
    Ventas: [ ],
    idOwner: { type: String },
    clientes: [ ],
    ownerPreference_idMP: {
        type: String,
    },
    nombrePagAppWeb: { type: String },

    transportEmail: {},
    //datos de beststaff    
    empresa: { type: String },
    cuit: { type: String },
    pathPhoto:{ type: String }, 
    pathLogo:{ type: String }, 
    name: { type: String },
    nombre:{ type: String },
    apellido: { type: String },
    email: { type: String },
    emailOficial: { type: String },
    otrosEmails : [],
    password: { type: String },
    user: { type: String },
    //datos  totales
    numCel: [],
    lat: { type: Number },
    long: { type: Number },
    country: { type: String },
    city: { type: String },
    cp: { type: String },
    calle: { type: String },
    numCalle: { type: Number },
    membresia: { type: String },
    precio: { type: Number },
    nombreEcommerce: { type: String },


    date: { type: Date, default: Date.now },

});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)};

module.exports = mongoose.model('User', UserSchema);