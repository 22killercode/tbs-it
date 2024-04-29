const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Esquema de Compra
const compraSchema = new mongoose.Schema({
    codigoPedido: String,
    fecha: Date,
    logoOwner: String,
    nombreEcomm: String,
    idCliente: String,
    idDueno: String,
    idPedido: String,
    tipoDePago: String,
    statusEnvio: String,
    listaProductos: [{
        imgProd: String,
        nombreProd: String,
        precio: Number,
        cantidadProductos: Number, // Agregado el campo cantidadProductos
        subTotalCompra: Number // Agregado el campo subTotalCompra
    }],
    totalProductos:Number,
    TotalCompra: Number
});

// Esquema de Usuario
const direccionSchema = new Schema({
    pais: String,
    ciudad: String,
    estado: String,
    CP: String,
    localidad: String,
    calle: String,
    numeroPuerta: Number,
    lng: String,
    lat: String,
    observaciones: String
});

const UserEcommSchema = new Schema({
    emailOficial: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    realPass: {
        type: String,
    },
    emails: [
        { emailCliente: String }
    ], // Array de Objetos
    
    numCel: [
        { numCelCliente: String }
    ], // Array de Objetos
        
    desingOwner: {
        type: String,
    },
    ipCliente: {
        type: String,
    },
    idCliente: {
        type: String,
    },

    clientPreference_idMP: {
        type: String,
    },

    idEcom: {
        type: String,
    },

    duenoEcom: [
        {
            urlOwner : String
        }
    ],
    
    imgCli:{
        type: String,      
    },
    
    direcciones: [direccionSchema], // Array de objetos de dirección
    // Definición del modelo Compra dentro del esquema de usuario
    comprasCliente: [compraSchema]
});

// Método para encriptar la contraseña
UserEcommSchema.methods.encryptPassword = async function(password) {
    if (!password) {
        throw new Error('Password cannot be empty');
    }
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const UserEcomm = mongoose.model('UserEcomm', UserEcommSchema);

module.exports = UserEcomm;
