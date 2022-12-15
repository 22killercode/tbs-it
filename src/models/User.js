const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    //datos de beststaff
    cheqPass: { type: String },
    catego: { type: String },
    puntos: { type: Number },
    empresa: { type: String },
    vendedor: { type: String, genValues: ['Vendedor/a Salon/PDV', 'Vendedor/a de Calle', 'Ejecutivo de Cuentas - Account Manager', 'Asesor Comercial','Encargada/o - Supervisor/a','CEO - Gerente Comercial','Jefe/a de Ventas / Coordinador/a'] },
    cuit: { type: String },
    pais: { type: String, genValues: ['Argentina', 'Bolibia', 'Chile', 'Colombia','Uruguay','Venezuela','Peru','Ecuador','Mexico','Guatemala','Costa Rica','Paraguay','Panama','España', 'Otro']},
    chengaPass:{ type: String },
    borrarApoyo:{ type: String },
    subJefe: { type: String, genValues: ['','', 'Otro']},
    jefe: { type: String, genValues: ['','', 'Otro']},
    rankingPuesto:{ type: String },
    cuit:{ type: String },
    nroPersonal:{ type: String },
    nroCliEmp:{ type: String },
    puntosEmpresa: { type: Number },
    statusInscrip:{ type: String },
    etapaGeo:{ type: String },
    subCargo:{ type: String }, 
    pathPhoto:{ type: String }, 
    pathLogo:{ type: String }, 

    fechaMailsEnviados:{ type: String },
    mailsDiariosUsados :{ type: String },

    puntosGuardados: { type: Number },
    puntosActivos: { type: Number },
    PuntosBlackPlus: { type: String },
    name: { type: String },
    apellido: { type: String },
    email: { type: String },
    password: { type: String },
    sebas: { type: String },
    user: { type: String },
    calificasion: { type: String },
    etapaUno: { type: String },
    etapa2: { type: String },
    etapa3Geo: { type: String },
    etapa3data: { type: String },
    etapa4: { type: String },
    soyUsuario: { type: String },
    referencia: { type: String },
    automatic: { type: String },
    tiempoReset: { type: String },
    //datos  totales
    genero: { type: String, genValues: ['masculino', 'femenino', 'ind'] },
    tipoDoc: { type: String, docValues: ['pas', 'ci', 'dni'] },
    numDoc: { type: String },
    fechaNac: { type: Date },
    numCel: { type: String },
    otroNum: { type: Number },
    tyc: false,
    cheq: { type: String },
    //direccion
    lat: { type: Number },
    long: { type: Number },
    country: { type: String },
    city: { type: String },
    state: { type: String },
    cp: { type: String },
    calle: { type: String },
    numCalle: { type: Number },
    sebastian: { type: String },
    usuarioBloqueado: { type: Boolean },
    //dataES
    tipoContrato: { type: String, tipoValues: ['empresario', 'Independiente'] },
    rangoDist: { type: Number, distValues: [5, 25, 50, 75, 100] },
    prueba: { type: String },
    ES: { type: String },
    story: { type: String },
    membresia: { type: String },
    RecargaBlackPlus: { type: String },
    tipoInscripcion: { type: String },
    mesLenght: { type: Number },
    OTLenght: { type: Number },
    cotiLenght: { type: Number },
    tiempo: { type: String },
    tiempoRecarga: { type: String },
    link1: { type: String },
    link2: { type: String },
    link3: { type: String },
    //Soluciones Express
    precio: { type: Number },
    venta: { type: String },
    idExcel: { type: String },
    idData: { type: String },
    culo: { type: String },
    idAdjCompleto: { type: String },
    
    ano: { type: String },
    mes: { type: String },
    dia: { type: String },
    hora : { type: String },
    fecha: { type: String },
    Q1: { type: Boolean },
    Q2: { type: Boolean },
    Q3: { type: Boolean },
    Q4: { type: Boolean },
    firstSemestre: { type: Boolean },
    secondSemestre: { type: Boolean },

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