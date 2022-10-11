require('dotenv').config();
const express   = require('express');
const router    = express.Router(); 
const passport  = require('passport');


const http   = require('http');
const server = http.Server(express);

//helpers
const { isAuthenticated } = require('../helpers/auth');
const nodemailer = require('nodemailer');

//models
const usuario       = require('../models/User');
const cotiStaffing  = require('../models/cotiStaffing'); 
const cotizaciones  = require('../models/cotizaciones');
const Tokens        = require('../models/Tokens');

const JSONTransport = require('nodemailer/lib/json-transport');
const { Script } = require('vm');
const PrecioDolar = 292
//Variables
const HorasMes             = 160
//precios TOP USS
const precioBackend        = 60
const precioFrontend       = 55
// descuentos por pais USS
const precioArg            = -25
const precioLatam          = -15
const precioUsaEur         = +5
// descuentos por señority USS
const precioTL             = +20
const precioSemiSenior     = -15
const precioJuniorAdnvance = -17
const precioJunior         = -19
const fullStack            = +10
const QAuto                = +3.5
//precios mobile
const precioAndroid        = +10
const precioIOS            = +12
//idioma
const idioma               = +3.5
//Precios software factory
//Bases
const paginaWeb      = 500
const appiRestFull   = 7000
const apiRestFullIOT = 20000
// Modulos
const ciberSeg1       = 10000
const PWAS1           = 5000
const clouding1       = 5000
const tracking1       = 7000
const pasarelaPagos1  = 5000
const Estadisticas1   = 5000


const validador1 = async( req, res, next) => {
    //    const dataUser = await dataUser11.findById(req.user.id);
    // validaciones, solo puede eliminar ceo coordi encar edmi 1 2 3 5 
    // const t = true
    const TToken = req.body.token
    console.log(" Al validador1 que token le llega desde el front",TToken,)
    const tokenCheq = await Tokens.findOne({token:TToken})
    console.log(" En el validador uno que token encuentra en la BD",tokenCheq)

    if (tokenCheq == null ) {
        console.log('Salio en NULL',tokenCheq,TToken)
        req.flash('error', 'Fallo en el validador, algún dato es incorrecto')
        res.redirect('/')
        return false 
    }
    else{
        const cheqToken = tokenCheq.token
        if (cheqToken != TToken) {
            console.log('llego al False estan hakeando',tokenCheq,TToken)
            req.flash('error', 'Fallo en el validador, algún dato es incorrecto')
            res.redirect('/')
            return false 
        }
        else{
            console.log('llego al next paso tiene la clave',TToken)
            await Tokens.findOneAndDelete({token:TToken});
            return next();
        }
    }
};

val2 = async( req, res, next) => {
    const {Nombre,Apellido,NumCel,Email,Empresa,Moneda,Ciudad,PagWeb} = req.body
    console.log(" desde el validador2 que viene en el req", req.body)

    const errors = [];

    if (Nombre.length <= 0) {
    errors.push({ text: 'Ingrese su nombre' });
    }
    if (Apellido.length <= 0) {
        errors.push({ text: 'Ingrese su apellido' });
    }
    if (NumCel.length <= 0) {
        errors.push({ text: 'Ingrese por número celular' });
    }
    if (Email.length <= 0) {
        errors.push({ text: 'Ingrese su Email' });
    }
    if (!Empresa) {
        errors.push({ text: 'Ingrese el nombre de su empresa' });
    }
    if (!Ciudad) {
        errors.push({ text: 'Ingrese el nombre de su ciudad' });
    }
    if (!Moneda) {
        errors.push({ text: 'Ingrese el tipo de moneda con el que piensa pagar' });
    }
    if (errors.length > 0) {
        console.log('llego al rechazada de datos personales',errors)        
        req.flash('errors', errors);
        res.redirect('/cotizandoStaffing');
    } else {
        console.log('paso por el aprobado de datos personales')
        return next();
        }
}

const cheqpass = async( req, res, next) => {
    const cheq = req.body
    const email = req.body.email
    const password = req.body.password
    console.log(" que llego al del req.body",email, password)
    const validar = await usuario.findOne({email:email})
    console.log(" que llego al validador cheqpass",cheq, validar)
    if(!validar){
        console.log("No hay datos",validar)
        req.flash('error', 'Fallo en el validador, Revise su Email ingresado')
        res.redirect('/')
        return false 
    }
    else{
        const cheqPass = (password+validar._id)
        console.log(" En el validador revisa el email y el password",cheqPass)
        if (email == validar.email && validar.password == cheqPass  ) {
            console.log('si valido el password')
            return next();
        }
            else{ 
                req.flash('error', 'Fallo en el validador, su password es incorrecto')
                res.redirect('/users/noestasRegistrado')
                return false 
        }
    }
}

function metodo1(a,b,c) {
    if (c) {
      return c
    } else {
      return 'Hi' + '_' + a + '_' + 'from' + '_' + b
    };
  };

module.exports = {
    validador1,
    val2,
    metodo1,
    cheqpass
};  