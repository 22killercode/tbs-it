const mongoose = require('mongoose');
const { Schema } = mongoose;

const carteraClientes = new Schema({
    //carteraClientes data
    user          : { type: String },
    idCliente     : { type: String },
    nombreEmpresa : { type: String },
    emailEmpresa  : { type: String },
    nroFiscal     : { type: String },
    datosContacto:[{
        contactoEliminado   : { type: String },
        idCliente           : { type: String },
        nombreContacto      : { type: String },
        idEmpresa           : { type: String },
        apellidoContacto    : { type: String },
        mailContacto        : { type: String },
        celContacto         : { type: String },
        numCelContacto2     : { type: String },
        telFijoCont         : { type: String },
        dirContacto         : { type: String },
        paisCont            : { type: String },
        ciudContact         : { type: String },
        localContact        : { type: String },
        cpCont              : { type: String },
        cargoContacto       : { type: String },
        obsCont             : { type: String },
        idCont              : { type: String },
    }],
    datosCliente:{
        direccioncliente : { type: String },
        direccioncliente2: { type: String },
        telefonoCliente  : { type: String },
        paisCliente      : { type: String },
        ciudadCliente    : { type: String },
        localidadCliente : { type: String },
        CPCliente        : { type: String },
        paginaWebcli     : { type: String },
        idCliente        : { type: String },
    },
    otrosDatos:{
        catEconomica: { type: String },
        catComercial: { type: String },
        ejecutivoEncargado: { type: String },
        supervisorEncargado: { type: String },
        coordinadorEncargado: { type: String },
        tecnicoEncargado: { type: String },
        descripcion: { type: String },
        CorpoMasivo: { type: String },
        rubro: { type: String },
        nroFiscal: { type: String },
        nroTelFijo: { type: Number },
        nroTelFijo2: { type: Number },
        dire1: { type: String },
        dire2: { type: String },
        obsClie: { type: String },
    },
    Q : { type: String },
    clienteEliminado: { type: String },
    idEmpresa: { type: String },
    idEmpleado: { type: String },
    mailEjec: { type: String },
    mailSup: { type: String },
    ano: { type: String },
    mes: { type: String },
    dia: { type: String },
    numDia: { type: String },
    hora : { type: String },
    fecha: { type: String },
    // Q1: { type: Boolean },
    // Q2: { type: Boolean },
    // Q3: { type: Boolean },
    // Q4: { type: Boolean },
    firstSemestre: { type: Boolean },
    secondSemestre: { type: Boolean },
    email: { type: String },
    password: { type: String },
    nomCamp: { type: String },
    objCamp: { type: String },
    subject: { type: String },
    bodyMail: { type: String },
    excel: { type: String },
    idData: { type: String },
    linki: { type: String },
    empresa: { type: String },
    nombreUser: { type: String },
    apellidoUser: { type: String },
    uploadPath: { type: String },
    numContUser: { type: String },
    IdAdj: { type: String },
    idMensaje: { type: String },
    idAdjunto: { type: String },
    idExcel: { type: String },
    idAdjCompleto: { type: String },
    //direccion
    cotiElejida: { type: String },
    ESemail: { type: String },
    titulo: { type: String },
    problema: { type: String },
    userDestino: { type: String },
    userOrigen: { type: String },
    nombreOrigen: { type: String },
    ciudadOrigen: { type: String },
    espia: { type: String },
    tituloResp: { type: String },
    respSolu: { type: String },
    cotizacion: { type: String },
    moneda: { type: String },
    pesos: { type: String },
    dolares: { type: String },
    euros: { type: String },
    otraMoneda: { type: String },
    idMensaje: { type: String },
    respondedor: { type: String },
    nombredlResponddor: { type: String },
    mensajeDestino: { type: String },
    cheqMes: { type: String },
    estadoCoti: { type: String },
    OTLenght: { type: String },
    OSLenght: { type: String },
    idmes: { type: String },
    idCoti: { type: String },
    estadoMes: { type: String },
    estadoCoti: { type: String },
    idMess: { type: String },
    idTrack: { type: String },
    cotiPerdida: { type: String },
    cuadras: { type: String },
    calificasion: { type: String },
    membresia: { type: String },
    distancia: { type: String },
    habilidad: { type: String },
    lat: { type: Number },
    long: { type: Number },
    nombre: { type: String },
    email: { type: String },
    rango: { type: Number },
    resumen: { type: String },
    ciudad: { type: String },
    apellido: { type: String },


    timeStamp: { type: String },

    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('carteraClientes', carteraClientes)