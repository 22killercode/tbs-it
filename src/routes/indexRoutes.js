require('dotenv').config();
const express   = require('express');
const router    = express.Router(); 
const passport  = require('passport');


const http    = require('http');
const server  = http.Server(express);

//midlewears
const {validador1,val2}        = require('../routes/Midlewares');
const { isAuthenticated } = require('../helpers/auth');

//appis
const nodemailer = require('nodemailer');
const shortid = require('shortid');

//models 
const usuario       = require('../models/User');
const Tokens        = require('../models/Tokens');
const cotiStaffing  = require('../models/cotiStaffing');
const cotizaciones  = require('../models/cotizaciones');
const mensajes      = require('../models/messages');
//middlewares
const JSONTransport = require('nodemailer/lib/json-transport');
const { Script } = require('vm');
const { nextTick } = require('process');
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
const paginaWeb      = 300
const appiRestFull   = 5000
const apiRestFullIOT = 20000
// Modulos
const ciberSeg1       = 10000
const PWAS1           = 5000
const clouding1       = 5000
const tracking1       = 7000
const pasarelaPagos1  = 5000
const Estadisticas1   = 5000


//
const setMinEraser = 1


//aqui programas el html inicial
router.get('/dataQuote1', (req, res) => {
    res.render('partials/softFactory/2SF')
});



//aqui programas el html inicial
router.get('/', (req, res) => {
    console.log('funca')
    res.render('partials/home');
});

//Ruta para llegar a Staffing
router.get('/Staffing', async (req, res) => {
    console.log('Llego a Staffing')
    res.render('partials/Staffing')
});

//Ruta para llegar a Staffing
router.get('/SoftDev', async (req, res) => {
    console.log('Llego a Staffing')
    res.render('partials/SoftDev')
});

//Ruta para llegar a Nosotros
router.get('/Nosotros', async (req, res) => {
    console.log('Llego a Staffing')
    res.render('partials/Nosotros')
});

//Ruta para llegar al Signin
router.get('/Signin', async (req, res) => {
    console.log('Llego a Staffing')
    res.render('partials/Signin')
});


//Ruta para eliminar talento
router.post('/eliminarTalento', async (req, res) => {
    const {_id,fullStack1,tecno,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} = req.body
    console.log('Llego a Staffing backend',req.body)
    const ID = _id
    // elimina el talento
    await cotiStaffing.findByIdAndDelete({_id})
    const PrecioDolar = 295
    console.log("REQ.BODY eliminar talento",req.body)
    const talents1 = await cotiStaffing.find({Email:Email});
    const cantTal  = talents1.length

    //datos
    const TotHorasMes        = []
    const totMeses           = []
    const precioFinal3mese   = []
    const precioFinal6mese   = []
    const precioFinal9mese   = []
    const precioFinal12mese  = []
    //Calculo total de meses
    for (const a1 of talents1) {
        const meses    = a1.Cantmeses
        const tecno    = a1.tecno
        const Idioma   = a1.Idioma
        const Senority = a1.senority
        const Pais     = a1.Pais
        const Moneda   = a1.Moneda
        const sumandotodo = []

        if (meses == '3 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*3 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*3)
                console.log("presio total del talento en 3 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 3meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                sumandotodo.push(QAuto)
                console.log("Idioma")
                }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*3 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*3)
                console.log("presio total del talento en 3 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 3meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '6 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*6 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*6)
                console.log("presio total del talento en 6 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 6 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                sumandotodo.push(QAuto)
                console.log("Idioma")
                }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*6 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*6)
                console.log("presio total del talento en 6 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 6 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '9 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*9 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*9)
                console.log("presio total del talento en 9 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 9 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                    sumandotodo.push(QAuto)
                    console.log("Idioma")
                    }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*9 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*9)
                console.log("presio total del talento en 9 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 9 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '12 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*12 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*12)
                console.log("presio total del talento en 12 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 12 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                    sumandotodo.push(QAuto)
                    console.log("Idioma")
                    }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*12 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*12)
                console.log("presio total del talento en 12 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 12 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
    };

    const talents = await cotiStaffing.find({Email:Email});
    // suma los meses
    const totalMeses = totMeses.reduce((a, b) => a + b, 0);
    // precio final por mesde todo el squad
    const array1 = precioFinal3mese.concat(precioFinal6mese);
    const array2 = precioFinal9mese.concat(precioFinal12mese);
    const array3 = array1.concat(array2);
    const costoF = array3.reduce((a, b) => a + b, 0);
    //Genera Token de seguridad en BD
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save();
    //revisa si es en dolares o pesos argentinos y renderiza
    if (Moneda == "Pesos Argentinos") {        
        const costoFinal = costoF * PrecioDolar
        const pesosArg = true
        // suma las horas totales
        const totalHoras = (totalMeses*HorasMes)
        // promedia cosato por hora grl
        const costoHoraPromedio1 = (costoFinal/totalHoras)
        const costoHoraPromedio = Math.round(costoHoraPromedio1)
        console.log("que hay ", totalMeses, costoHoraPromedio,costoFinal,totalHoras)
        res.render('partials/2cotizando',{token,ID,fullStack1, pesosArg,costoHoraPromedio,costoFinal,totalHoras,cantTal,talents,tecno,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} )
    } else {
        // promedia cosato por hora grl
        const costoFinal = costoF
        const totalHoras = (totalMeses * HorasMes)
        // promedia cosato por hora grl
        const costoHoraPromedio1 = (costoFinal/totalHoras)
        const costoHoraPromedio = Math.round(costoHoraPromedio1)
        //console.log("que hay ", totalMeses, costoHoraPromedio,costoFinal,totalHoras)
        res.render('partials/2cotizando',{token,ID,fullStack1, costoHoraPromedio,costoFinal,totalHoras,cantTal,talents,tecno,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} )

    }

});

// Ruta para ir a cotizar staffing
router.get('/cotizandoStaffing', async (req, res) => {
    //Genera Token de seguridad en BD
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save();
    res.render('partials/1cotiStaffing',{token})
    // revisar si hay aulgun token sin usar y lo borra
    const cheqVencimiento = await Tokens.find();
    console.log("cuantos token encontro",cheqVencimiento )
    const cheqTime        = new Date()
    for (const a1 of cheqVencimiento) {
        const tiempo       = a1.date
        const difDtiempo   = (cheqTime - tiempo)
        const difTiempoMins = (parseInt(difDtiempo) / 1000 / 60 / 60 )
        console.log("cuanta diferencia de tiempo hay",difTiempoMins )
        if (difTiempoMins >= setMinEraser) {
            const _id = a1._id
            await Tokens.findByIdAndDelete(_id)
            console.log("Borro un token" )
        };
    };
});

router.get('/staffingData1', async (req, res) => {
    res.render('partials/2cotizando')
});
//Ruta para obtener los datos de staffing
router.post('/staffingData', [val2, validador1],async (req, res) => {
    const {Nombre,Apellido,NumCel,Email,Empresa,Moneda,Ciudad,PagWeb} = req.body
    //Genera Token de seguridad en BD
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save()
    console.log('llego a Stafingdata los datos personales',req.body)
    const data = {Nombre,Apellido,NumCel,Email,Empresa,Moneda,Ciudad,PagWeb}
    //console.log('Llego a Staffing backend',req.body, data)
    if (Moneda == "Pesos Argentinos") {
        const pesosArg = true
        res.render('partials/2cotizando', {data,pesosArg, token,Nombre,Apellido,NumCel,Email,Empresa,Moneda,Ciudad,PagWeb})
    } else {
        res.render('partials/2cotizando', {data, token,Nombre,Apellido,NumCel,Email,Empresa,Moneda,Ciudad,PagWeb})
    }
});

//Ruta para cotizar los recursos
router.post('/cotizandoIT',[validador1], async (req, res) => {
    //Genera Token de seguridad en BD
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save();

    const {tecno,fullStack1,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} = req.body;
    console.log("Que llega a cotizandoIT",req.body)
    const talentos = new cotiStaffing({Email,fullStack1,tecno,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Empresa,Pais,Ciudad,PagWeb});
    const ID = talentos._id
    await talentos.save();
    const talents1 = await cotiStaffing.find({Email:Email});
    const cantTal  = talents1.length
    //datos
    const totMeses           = []
    const precioFinal3mese   = []
    const precioFinal6mese   = []
    const precioFinal9mese   = []
    const precioFinal12mese  = []

    //Calculo total de meses
    for (const a1 of talents1) {
        const meses    = a1.Cantmeses
        const tecno    = a1.tecno
        const Idioma   = a1.Idioma
        const Senority = a1.senority
        const Pais     = a1.Pais
        const Moneda   = a1.Moneda
        const sumandotodo = []

        if (meses == '3 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*3 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*3)
                console.log("presio total del talento en 3 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 3meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                sumandotodo.push(QAuto)
                console.log("Idioma")
                }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*3 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*3)
                console.log("presio total del talento en 3 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                //console.log("cual es el precio final 3meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '6 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*6 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*6)
                console.log("presio total del talento en 6 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 6 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                sumandotodo.push(QAuto)
                console.log("Idioma")
                }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*6 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*6)
                console.log("presio total del talento en 6 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 6 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '9 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*9 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*9)
                console.log("presio total del talento en 9 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 9 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                    sumandotodo.push(QAuto)
                    console.log("Idioma")
                    }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*9 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*9)
                console.log("presio total del talento en 9 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 9 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '12 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*12 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*12)
                console.log("presio total del talento en 12 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 12 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                    sumandotodo.push(QAuto)
                    console.log("Idioma")
                    }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*12 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*12)
                console.log("presio total del talento en 12 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 12 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
    };

    const talents     = await cotiStaffing.find({Email:Email});
    // suma los meses
    const totalMeses = totMeses.reduce((a, b) => a + b, 0);
    // precio final por mesde todo el squad
    const array1 = precioFinal3mese.concat(precioFinal6mese);
    const array2 = precioFinal9mese.concat(precioFinal12mese);
    const array3 = array1.concat(array2);
    const costoF = array3.reduce((a, b) => a + b, 0);

    //revisa si es en dolares o pesos argentinos y renderiza
    if (Moneda == "Pesos Argentinos") {        
        const costoFinal = costoF * PrecioDolar
        const pesosArg = true
        // suma las horas totales
        const totalHoras = (totalMeses*HorasMes)
        // promedia cosato por hora grl
        const costoHoraPromedio1 = (costoFinal/totalHoras)
        const costoHoraPromedio = Math.round(costoHoraPromedio1)
        //console.log("Calculo final ", totalMeses, costoHoraPromedio,costoFinal,totalHoras)
        res.render('partials/2cotizando',{token,ID,fullStack1, pesosArg,costoHoraPromedio,costoFinal,totalHoras,cantTal,talents,tecno,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} )
    } else {
        // promedia cosato por hora grl
        const costoFinal = costoF
        const totalHoras = (totalMeses * HorasMes)
        // promedia cosato por hora grl
        const costoHoraPromedio1 = (costoFinal/totalHoras)
        const costoHoraPromedio = Math.round(costoHoraPromedio1)
        //console.log("que hay ", totalMeses, costoHoraPromedio,costoFinal,totalHoras)
        res.render('partials/2cotizando',{token,ID,fullStack1, costoHoraPromedio,costoFinal,totalHoras,cantTal,talents,tecno,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} )

    }

});

//Ruta para cotizar los recursos
router.post('/volverIT',[validador1], async (req, res) => {
    //Genera Token de seguridad en BD
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save();

    const {tecno,fullStack1,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} = req.body;
    console.log("Que llega a cotizandoIT",req.body)
    const talents1 = await cotiStaffing.find({Email:Email});
    const ID = talents1._id
    const cantTal  = talents1.length
    //datos
    const totMeses           = []
    const precioFinal3mese   = []
    const precioFinal6mese   = []
    const precioFinal9mese   = []
    const precioFinal12mese  = []

    //Calculo total de meses
    for (const a1 of talents1) {
        const meses    = a1.Cantmeses
        const tecno    = a1.tecno
        const Idioma   = a1.Idioma
        const Senority = a1.senority
        const Pais     = a1.Pais
        const Moneda   = a1.Moneda
        const sumandotodo = []

        if (meses == '3 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*3 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*3)
                console.log("presio total del talento en 3 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 3meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                sumandotodo.push(QAuto)
                console.log("Idioma")
                }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*3 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*3)
                console.log("presio total del talento en 3 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                //console.log("cual es el precio final 3meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '6 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*6 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*6)
                console.log("presio total del talento en 6 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 6 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                sumandotodo.push(QAuto)
                console.log("Idioma")
                }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*6 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*6)
                console.log("presio total del talento en 6 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 6 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '9 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*9 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*9)
                console.log("presio total del talento en 9 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 9 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                    sumandotodo.push(QAuto)
                    console.log("Idioma")
                    }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*9 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*9)
                console.log("presio total del talento en 9 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 9 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
        if (meses == '12 meses') {
            totMeses.push(3)
            //calculo del precio
            if (tecno == 'JAVA' ||tecno == "JS" ||tecno == "NODE" ||tecno == "Django" ||tecno == "Python" ||tecno == "GO" ||tecno == "PHP" ||tecno == "C#" ||tecno == "C++" ||tecno == ".Net" ||tecno == "Kotlin" ||tecno == "Pearl" ||tecno == "Apache" ||tecno == "Ruby" ||tecno =="Cobol") {
                console.log("entro por el bakend")
                sumandotodo.push(precioBackend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por fullStack
                if (fullStack1 == "Full Stack LAMP" ||fullStack1 ==  "Full Stack MERN / MEAN" ||fullStack1 ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*12 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*12)
                console.log("presio total del talento en 12 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 12 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
            }else{
                console.log("entro por el fronend")
                sumandotodo.push(precioFrontend)
                //suma por idioma
                if (Idioma !== "Español") {
                    sumandotodo.push(idioma)
                    console.log("Idioma")
                }
                //suma por idioma
                if (tecno == "QA Automation") {
                    sumandotodo.push(QAuto)
                    console.log("Idioma")
                    }
                //suma por fullStack
                if (tecno == "Full Stack LAMP" ||tecno ==  "Full Stack MERN / MEAN" ||tecno ==  "Full Stack Grl.") {
                    sumandotodo.push(fullStack)
                    console.log("fullStack")
                }
                // calculo por Pais
                if (Pais == "USA" || Pais == "Europa" || Pais == "Otro") {
                    sumandotodo.push(precioUsaEur)
                    console.log("Europa",Pais)
                }
                if (Pais == "Argentina") {
                    sumandotodo.push(precioArg)
                    console.log("Argentina")
                }
                if (Pais == "Latam sin Arg.") {
                    sumandotodo.push(precioLatam)
                    console.log("Latam")
                }
                //Calculo por señority
                if (Senority == "Junior 1 año") {
                    sumandotodo.push(precioJunior)
                    console.log("Junior")
                }
                if (Senority == "Junior Advance 2años") {
                    sumandotodo.push(precioJuniorAdnvance)
                    console.log("Advance")
                }
                if (Senority == "Semi Senior 4 años") {
                    sumandotodo.push(precioSemiSenior)
                    console.log("Semi")
                }
                if (Senority == "Technical Leader 8 años") {
                    sumandotodo.push(precioTL)
                    console.log("Technical")
                }
                //Mobile
                if (tecno == "Android") {
                    sumandotodo.push(precioAndroid)
                    console.log("Android")
                }
                if (tecno == "IOS") {
                    sumandotodo.push(precioIOS)
                    console.log("IOS")
                }
                console.log("que hay en sumando todo",sumandotodo)
                // sumamos todo
                const PrecioFinalHora = sumandotodo.reduce((a, b) => a + b, 0);
                console.log("PrecioFinalHora",PrecioFinalHora )
                const cantTotalHoras = parseInt(HorasMes)*12 //de cada talento elegido
                console.log("cantTotalHoras",cantTotalHoras )
                const presio1 = (parseInt(PrecioFinalHora)*parseInt(HorasMes)*12)
                console.log("presio total del talento en 12 meses",presio1 )
                // lu subimos al array para que sume con los otros talentos elegidos
                precioFinal3mese.push(presio1)
                const Preci = presio1
                console.log("cual es el precio final 12 meses?",presio1 )
                if (Moneda == "Pesos Argentinos") {
                    const Precio = Preci * PrecioDolar
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }else{
                    const Precio = Preci
                    await cotiStaffing.findByIdAndUpdate(ID,{Precio,PrecioFinalHora,cantTotalHoras})
                }
                }
        }
    };

    const talents     = await cotiStaffing.find({Email:Email});
    // suma los meses
    const totalMeses = totMeses.reduce((a, b) => a + b, 0);
    // precio final por mesde todo el squad
    const array1 = precioFinal3mese.concat(precioFinal6mese);
    const array2 = precioFinal9mese.concat(precioFinal12mese);
    const array3 = array1.concat(array2);
    const costoF = array3.reduce((a, b) => a + b, 0);

    //revisa si es en dolares o pesos argentinos y renderiza
    if (Moneda == "Pesos Argentinos") {        
        const costoFinal = costoF * PrecioDolar
        const pesosArg = true
        // suma las horas totales
        const totalHoras = (totalMeses*HorasMes)
        // promedia cosato por hora grl
        const costoHoraPromedio1 = (costoFinal/totalHoras)
        const costoHoraPromedio = Math.round(costoHoraPromedio1)
        //console.log("Calculo final ", totalMeses, costoHoraPromedio,costoFinal,totalHoras)
        res.render('partials/2cotizando',{token,ID,fullStack1, pesosArg,costoHoraPromedio,costoFinal,totalHoras,cantTal,talents,tecno,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} )
    } else {
        // promedia cosato por hora grl
        const costoFinal = costoF
        const totalHoras = (totalMeses * HorasMes)
        // promedia cosato por hora grl
        const costoHoraPromedio1 = (costoFinal/totalHoras)
        const costoHoraPromedio = Math.round(costoHoraPromedio1)
        //console.log("que hay ", totalMeses, costoHoraPromedio,costoFinal,totalHoras)
        res.render('partials/2cotizando',{token,ID,fullStack1, costoHoraPromedio,costoFinal,totalHoras,cantTal,talents,tecno,senority,Cantmeses,Idioma,Moneda,Nombre,Apellido,NumCel,Email,Empresa,Pais,Ciudad,PagWeb} )

    }

});

//Ruta para agendar la entrevista antes de enviar coti MAIL VALIDADOR
router.post('/calculandoCotizacion', [validador1],  async (req, res) => {
    const {Email,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal} = req.body
    //Genera Token de seguridad en BD 
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save()
    //guardar en base de datos como coti formal
    const talents     = await cotiStaffing.find({Email:Email});
    console.log("Que llega a calculandoCotizacion", talents)
    if (talents.length == 0) {
        req.flash('error', 'Empieza de nuevo y agrega algún talento');
        res.redirect('/');
    } else {
    const guardarCoti = new cotizaciones ({talents,Email,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal})
    const ID = guardarCoti._id
//    console.log("Que id tiene desde clculando cotizacion",ID)
    await guardarCoti.save()
               // revisa si ese email ya esta validado y renderiza
                const validarEmail = await Tokens.findOne({Email:Email});
                if (validarEmail == null) {
                    res.render('partials/validadorStaffing', {Email,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal,ID});
                    // enviar mail para validar staffing
                    const contentHTML = `<html>
                    <body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
                    <div style="justify-content: center ; align-items: center;">
                    <h2>
                        <strong>${Nombre}</strong>
                        <br>
                        Por favor vuelve a tu pagina web e ingresa el codigo alfanumerico que esta escrito abajo, para validar tus datos y en breve te estara llegando nuestra pre-cotizacion.
                    </h2>
                        <div style="text-align: center; justify-content: center; background:black; color:white;">
                            <h1>
                                ${token}
                            </h1>
                        </div>
                    <div class="" style="text-align: left; align-items: left;">
                    <br>
                    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
                    </div>
                    </div>
                    </div>
                    </body>
                    </html>`;
                    const email = "tbs-it.info@tbs-it.net"
                    const senderMail = email
// google
                    // const transporter = nodemailer.createTransport({
                    //     service: 'gmail',
                    //     auth: {
                    //     user: email,
                    //     pass: password,
                    //     }
                    // });
                    
    // con EL MAIL DEL CLIENTE ADMINISTRADO POR Hostinger
    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "tbs-it.info@tbs-it.net",
            pass: "Sebatbs@22",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

                    let conAdjunto = {
                        from: senderMail, // sender address,
                        to: Email,
                        subject: "Hola"  + ' ' + Nombre  + ' ' + "Valida tu Email en TBS-IT company",
                        html: contentHTML,
                    };
                    transporter.sendMail(conAdjunto, (er,info)=>{
                        if(er){
                        console.log("error",er)
                        }else{
                            console.log("info",info) 
                        }
                    });
                } else {
                    res.render('partials/3agenda', {token,Email,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal,ID})
                }
            }
});

router.post('/validarStaffing',[validador1],  async (req, res) => {
    const {Email,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal,ID} = req.body
    //Genera Token de seguridad en BD
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save()
    res.render('partials/3agenda', {token,Email,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal,ID})
    // valida el email
    const mailValidado = true
    const validar = new Tokens({Email,mailValidado});
    await validar.save()
});

//Ruta para calcular y enviar cotizacion Staffing por mail
router.post('/EnviarCotizacion',[validador1], async (req, res) => {
    const {ID,tipoCont,pesosArg,fechaContact,Obs, Email,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal} = req.body
    console.log("Se logro enviar coti staffing por mails",req.body)
    const data = await cotizaciones.findByIdAndUpdate({_id:ID},{tipoCont,fechaContact,Obs},{new:true})
    const Talent1 = data.talents
    const dataM = []
    // Arma la lista de los datos de cada uno de los talentos cotizadios para enviar por mail
    for (const a1 of Talent1) {
        const tecno  = a1.tecno
        const sen    = a1.senority
        const tiempo = a1.Cantmeses
        const Idioma = a1.Idioma
        const Pais   = a1.Pais
        const Precio   = a1.Precio
        const culo =(`		
            <tbody style="whidt:max-content; padding:0.2rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">
                <tr style="padding:0.2rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">
                    <td  style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">${tecno}</td>
                    <td  style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">${sen}</td>
                    <td  style="whidt:max-content;padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">${tiempo}</td>
                    <td  style="whidt:max-content;padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">$${Precio}</td>
                </tr>
            </tbody>
            `)
            dataM.push(culo)
    }
    //console.log("que Se logro ANTES del splice",dataM)
    const dataM2 = dataM.splice(",")
    //console.log("que Se logro con splice",dataM2)

    // pasar a pantalla que muestra formalmente la cotizacion y aradecimiento
res.render("partials/4verCoti",{Talent1,pesosArg,tipoCont,fechaContact,Obs, Email,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal})

// envia por mail la cotizacion
const contentHTML = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
<div style="justify-content: center ; align-items: center;">
<p>
<strong>${Nombre}</strong> es un privilegio, para nosotros, poder ser considerados candidatos como proveedores y ayudarlos a lograr sus objetivos.
    <br>
    TBS es una compañía dedicada a la creación de soluciones en el campo de tecnologías de la información. Contamos con talento de alto valor, con experiencia y constantemente actualizados sobre las últimas tecnologías con el fin de brindar el mejor servicio. 
    <br>
    Por tres meses o un año, por un solo recurso o un equipo completo, ofrecemos los mejores recursos con experiencia directa en su industria y con los sistemas y tecnologías que necesita, asi que nuevamente, gracias por elegirnos, como socio tecnológico, a la hora de abordar sus proyectos.
</p>
</div>
<div class="" style="text-align: left; align-items: left;">
<h4>Datos:</h4>
<p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
<p><strong>Empresa:</strong> ${Empresa}  <span></span><strong>Email de contacto:</strong> ${Email}</p>
<p><strong> Moneda de facturacion:</strong> ${Moneda}</p>
Esta pre-cotizacion carece de responsabilidad contractual entre las partes. Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
</div>   
<div style="">
    <h3 style="padding: 0.3rem;">
        Breve resumen de la pre-cotizacion solicitada en el dia de la fecha.
    </h3>
    <table style="border-width: 2px; border-style: solid; border-color: black; margin:auto; width: 47%;">
        <thead style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">
            <tr style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;"">
                <th style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">Tecnologia</th>
                <th style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">Señority</th>
                <th style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">Tiempo</th>
                <th style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">Sub Total</th>
            </tr>
        </thead>
        <div > ${dataM2} </div>
    </table>


    <h4 style="padding: 0.3rem; align-items: center">
        Cantidad de talentos  ${cantTal} | Total de horas ${totalHoras}  |  Promedio por hora $ ${costoHoraPromedio} | Total Contrato $ ${costoFinal}
    </h4>
    
</div>
    <div style="width: 110%; margin: 0.1rem auto; text-align: center;" class="center">
        <p>*Consulta por importantes descuentos. </p>
        <p>*Los precios no incluyen iva ni impuestos.</p>
        <br>
        *Nuesto Ejecutivo de Cuentas se pondrá en contacto con usted en la fecha y el horario que nos indico
        <br>
        <br>
        <h4>
        Fecha de contacto: ${fechaContact} de la ciudad de: ${Ciudad}  Tipo de contacto:  ${tipoCont}
        <br>
        Observaciones:
        <br>
        ${Obs}
        <br>
        </h4>
    </div>
    <br>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
</div>
</div>
</div>
</body>
                    </html>`;
// aviso al Ejecutivo cuentas
const cotiEntro = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
<div style="justify-content: center ; align-items: center;">
<p>
    Entro el siguiente pedido de cotizacion de: ${Empresa}
</p>
</div>
<div class="" style="text-align: left; align-items: left;">
<h4>Datos:</h4>
<p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
<p><strong>Empresa:</strong> ${Empresa}  <span></span><strong>Email de contacto:</strong> ${Email}</p>
<p><strong> Moneda de facturacion:</strong> ${Moneda}</p>
Ponte en contacto con el cliente en el horario que el solicito y logra cerrar una propuesta formal averiguando sus nececidades descubriendo nuevas, sus puntos de dolor. Tambien ponte en contacto con tu lider y acuerden una estrategia y propuesta formal que se envia con copia a tu lider e incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
</div>   
<div style="align-items: center;">
    <h3 style="padding: 0.3rem;">
        Breve resumen de la pre-cotizacion solicitada en el dia de la fecha.
    </h3>
    <table style="border-width: 2px; border-style: solid; border-color: black; margin:auto; width: 47%;">
    <thead style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">
        <tr style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;"">
            <th style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">Tecnologia</th>
            <th style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">Señority</th>
            <th style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">Tiempo</th>
            <th style="whidt:max-content; padding:0.6rem; margin:0.2rem; border-width: 2px; border-style: solid; border-color: black;">Sub Total</th>
        </tr>
    </thead>
    <div> ${dataM2} </div>
</table>
    <h4 style="padding: 0.3rem; align-items: center">
        Cantidad de talentos  ${cantTal} | Total de horas ${totalHoras}  |  Promedio por hora $ ${costoHoraPromedio} | Total Contrato $ ${costoFinal}
    </h4>
</div>
    <div style="width: 110%; margin: 0.1rem auto; text-align: center;" class="center">
        <p>*Consulta por importantes descuentos. </p>
        <p>*Los precios no incluyen iva ni impuestos.</p>
        <br>
        *Deberas ponerte en contacto con el cliente en la fecha y el horario que nos indico.
        <br>
        <h4>
        Fecha de contacto: ${fechaContact} de la ciudad de: ${Ciudad}  Tipo de contacto:  ${tipoCont}
        <br>
        Observaciones:
        <br>
        ${Obs}
        <br>
        </h4>
    </div>
    <br>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
</div>
</div>
</div>
</body>
                    </html>`;
                    
    // // con EL MAIL DEL CLIENTE ADMINISTRADO POR GOOGLE
    const email45 = "sebastianpaysse@gmail.com"
    const password45 = "qtwcqebleraupety"
    // const senderMail = email
    const transporter3 = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: email45,
        pass: password45,
        }
    });
    // con EL MAIL DEL CLIENTE ADMINISTRADO POR Hostinger
    const email = "tbs-it.info@tbs-it.net"
    const senderMail = email

    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "tbs-it.info@tbs-it.net",
            pass: "Sebatbs@22",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    const transporter1 = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "tbs-it.info@tbs-it.net",
            pass: "Sebatbs@22",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });


    let conAdjunto = {
        from: senderMail, // sender address,
        to: Email,
        subject: "Hola"  + ' ' + Nombre  + ' ' + "TBS IT te envío una pre cotizacion",
        html:contentHTML ,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };
    let alaEmpresa = {
        from: senderMail, // sender address,
        to: Email,
        subject: "Enhorabuena!!! entro una nueva cotizacion de" + ' ' + Empresa  + ' ' ,
        html: cotiEntro,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };
    transporter.sendMail(conAdjunto, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
    transporter1.sendMail(alaEmpresa, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
    transporter3.sendMail(alaEmpresa, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
// borrar todos los otros datos
const todos = await cotiStaffing.find({Email:Email})
for (const a1 of todos) {
    const _id = a1._id
    await cotiStaffing.findByIdAndDelete({_id})
}

});

//Ruta para borrar todo y volver a empezar
router.post('/reset', async (req, res) => {
    const {Email} = req.body
    const todos = await cotiStaffing.find({Email:Email})
    for (const a1 of todos) {
        const _id = a1._id
        await cotiStaffing.findByIdAndDelete({_id})
    };
    res.redirect("/cotizandoStaffing")
});

//  fin cotizacion
router.post('/finalCoti', async (req, res) => {
const {Nombre} = req.body
res.render("partials/5finCoti",{Nombre})
});

//*******************COTIZACION DE SOFTWARE****************************************************** */

//Ruta para cotizar software
router.get('/cotizarSoftware',async (req, res) => {
        //Genera Token de seguridad en BD
        const token = shortid.generate()
        const guardarToken = new Tokens ({ token })
        await guardarToken.save();
        res.render('partials/softFactory/1SF',{token})
        // revisar si hay aulgun token sin usar y lo borra
        const cheqVencimiento = await Tokens.find();
//        console.log("cuantos token encontro",cheqVencimiento )
        const cheqTime        = new Date()
        for (const a1 of cheqVencimiento) {
            const tiempo       = a1.date
            const difDtiempo   = (cheqTime - tiempo)
            const difTiempoMins = (parseInt(difDtiempo) / 1000 / 60 / 60 )
  //          console.log("cuanta diferencia de tiempo hay",difTiempoMins )
            if (difTiempoMins >= setMinEraser) {
                const _id = a1._id
                await Tokens.findByIdAndDelete(_id)
                console.log("Borro un token" )
            };
        };
});

//Ruta para cotizar software
router.post('/dataQuote', [validador1], async (req, res) => {
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save()
    const {} = req.body
    const data = req.body
    console.log("que trae a cotizando soft", data)
    res.render('partials/softFactory/2SF', {data,token})
});

//  Agenda distruibuidora de entrevistas
router.post('/agendarEntrevista', [validador1], async (req, res) => {
    const {tecnoBackend,PgWb,sofObjetivo,RubroEmp, tecnoFrontend, custom,appirestFull,IOT,Email,SD,pw,PWA,Estadisticas,pasarelaPagos,clouding,traking,CiberSeg,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal} = req.body

    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save()

    const data = req.body

    // hacer los 4 if para enviar a cada agenda de cita y de ahi a guardar
    if (PgWb) {
        res.render("partials/agendas/agendaPW",{Nombre, data, token})
    } else {
        if (appirestFull) {
            console.log("que hay en el req body / appirest", req.body);
            res.render("partials/agendas/agendaAPPIREST",{Nombre, data, token})
        } else {
            if (IOT) {
                res.render("partials/agendas/AgendaIOT",{Nombre, data, token})
            } else {
                if (custom) {
                    console.log("que hay en el req body / custom", req.body);
                    res.render("partials/agendas/AgendaCustom",{Nombre, data, token})
                } else {
                    // Staffing
                    res.render("partials/3agenda",{Nombre, data, token})
                }
            }
        }        
    }
});

// Calculo de cotizacion pagina web
router.post('/EnviarCotizacionPW',[validador1], async (req, res) => {
    const {CustomSoft,appirestFull,IOT,Email,SD,pw,PWA,Estadisticas,pasarelaPagos,clouding,traking,CiberSeg,pesosArg,Nombre,Apellido,tipoCont,Obs,Ciudad,fechaContact,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal} = req.body
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save()
    const data =  req.body
    console.log("que llega a calculo /EnviarCotizacionPW",data)
    const puto = []
    if (Moneda == "Pesos Argentinos") {
        const precio = (paginaWeb * PrecioDolar)
        puto.push(precio)
    } else {
        const precio = paginaWeb
        puto.push(precio)
    }
    const suma = puto[0] 
    console.log("cuanto vale una pagina eb en argentos?", suma)
    res.render('partials/cotisSoftFactory/cotipagWeb', {suma, data, token});
    // Guarda en BD
    const PW = true
    const guardarCoti = new cotizaciones ({PW,CustomSoft,appirestFull,IOT,Email,SD,pw,PWA,Estadisticas,pasarelaPagos,clouding,traking,CiberSeg,pesosArg,Nombre,Apellido,tipoCont,Obs,Ciudad,fechaContact,NumCel,Empresa,PagWeb,Moneda,costoHoraPromedio,costoFinal,totalHoras,cantTal})
    await guardarCoti.save()
    // envia por mail la cotizacion
const contentHTML = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>

<div style="justify-content: center ; align-items: center;">
    <p>
    <strong>${Nombre}</strong> es un privilegio, para nosotros, poder ser considerados candidatos como proveedores y ayudarlos a lograr sus objetivos.
        <br>
        TBS es una compañía dedicada a la creación de soluciones en el campo de tecnologías de la información. Contamos con talento de alto valor, con experiencia y constantemente actualizados sobre las últimas tecnologías con el fin de brindar el mejor servicio. 
        <br>
        Por tres meses o un año, por un solo recurso o un equipo completo, ofrecemos los mejores recursos con experiencia directa en su industria y con los sistemas y tecnologías que necesita, asi que nuevamente, gracias por elegirnos, como socio tecnológico, a la hora de abordar sus proyectos.
    </p>
</div>
<div class="" style="text-align: left; align-items: left;">
    <h4>Datos:</h4>
    <p style="margin-top:-3rem">
        <strong>Nombre:</strong> ${Nombre}  <span></span><span></span><strong>Apellido:</strong> ${Apellido}
        <br>
        <strong>Empresa:</strong> ${Empresa}
        <br>
        <strong>Email de contacto:</strong> ${Email}
        <br>
        <strong> Moneda de facturacion:</strong> ${Moneda}
    </p>
    Esta pre-cotizacion carece de responsabilidad contractual entre las partes. Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
    <br>
    <br>
    El precio puede variar desde un inicial de <strong> Valor ${Moneda}: $${suma} </strong> o mas, segun requerimientos del cliente.
    <br>
    <br>
    Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
    <br>
    consulte con su Ejecutivo de cuentas asignado todas las cuestiones tecnicas y dudas que tenga asi como bonificasiones.
</div>

<div style="width: 110%; margin: 0.1rem auto; text-align: center;" class="center">
    <p>*Consulta por importantes descuentos. </p>
    <p>*Los precios no incluyen iva ni impuestos.</p>
    <br>
    *Nuesto Ejecutivo de Cuentas se pondrá en contacto con usted en la fecha y el horario que nos indico
    <br>
    <br>
    Fecha de contacto: ${fechaContact} de la ciudad de: ${Ciudad}  Tipo de contacto:  ${tipoCont}
    <br>    
    Observaciones:
    <br>
    ${Obs}
    <br>
</div>
    <br>
<div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden>
    <h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6>
<div><span></span><a href="http://tbsit.co">
</body>
</html>`;
const cotiEntro = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
<div style="justify-content: center ; align-items: center;">
<p>
    Entro el siguiente pedido de cotizacion de: ${Empresa}
</p>
</div>
<div class="" style="text-align: left; align-items: left;">
<h4>Datos:</h4>
<p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
<p><strong>Empresa:</strong> ${Empresa}  <span></span><strong>Email de contacto:</strong> ${Email}</p>
<p><strong> Moneda de facturacion:</strong> ${Moneda}</p>
<br>
El precio puede variar desde un inicial de <strong> Valor: ${suma} dolares </strong> hasta $2000 mi dolares, segun requerimientos del cliente.
<br>
Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
<br>
consulte con su Ejecutivo de cuentas asignado todas las cuestiones tecnicas y dudas que tenga asi como bonificasiones.
<br>
Ponte en contacto con el cliente en el horario que el solicito y logra cerrar una propuesta formal averiguando sus nececidades descubriendo nuevas, sus puntos de dolor. Tambien ponte en contacto con tu lider y acuerden una estrategia y propuesta formal que se envia con copia a tu lider e incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
</div>   
    <div style="width: 110%; margin: 0.1rem auto; text-align: center;" class="center">
        <p>*Consulta por importantes descuentos. </p>
        <p>*Los precios no incluyen iva ni impuestos.</p>
        <br>
        *Deberas ponerte en contacto con el cliente en la fecha y el horario que nos indico.
        <br>
        <br>
        Fecha de contacto: ${fechaContact} de la ciudad de: ${Ciudad}  Tipo de contacto:  ${tipoCont}
        <br>    
        Observaciones:
        <br>
        ${Obs}
        <br>
    </div>
    <br>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
</div>
</div>
</div>
</body>
</html>`;
        // con EL MAIL DEL CLIENTE ADMINISTRADO POR Hostinger
        const email = "tbs-it.info@tbs-it.net"
        const senderMail = email
    
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: "tbs-it.info@tbs-it.net",
                pass: "Sebatbs@22",
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        });
    
        const transporter1 = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: "tbs-it.info@tbs-it.net",
                pass: "Sebatbs@22",
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        });
    

    let conAdjunto = {
        from: senderMail, // sender address,
        to: Email,
        subject: "Hola"  + ' ' + Nombre  + ' ' + "TBS IT te envío una pre cotizacion",
        html:contentHTML ,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };
    let alaEmpresa = {
        from: senderMail, // sender address,
        to: Email,
        subject: "Enhorabuena!!! entro una nueva cotizacion de" + ' ' + Empresa  + ' ' ,
        html: cotiEntro,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };
    transporter.sendMail(conAdjunto, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
    transporter1.sendMail(alaEmpresa, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
});

// Calculo de cotizacion aplicasion web y tambien IOT
router.post('/EnviarCotizacionAPPIREST',[validador1], async (req, res) => {
    const {fechaContact,tipoCont,Obs,CustomSoft,appirestFull,IOT,Email,SD,pw,PWA,Estadisticas,pasarelaPagos,clouding,traking,CiberSeg,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda} = req.body
    const data = {fechaContact,tipoCont,Obs,CustomSoft,appirestFull,IOT,Email,SD,pw,PWA,Estadisticas,pasarelaPagos,clouding,traking,CiberSeg,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda}
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save()
  // console.log("que llega a calculo /EnviarCotizacion APPIREST",data,IOT)
    const sumar   = []
    const baseAR  = appiRestFull
    const baseIOT = apiRestFullIOT
    const desarrollo = []
    if (IOT) {
        sumar.push(baseIOT)
        desarrollo.push(`Appi Rest Full I.O.T.`)        
    } else {
        sumar.push(baseAR)
        desarrollo.push(`Appi Rest Full / Aplicasion WEB`)        
    }
// dato para los mails
const dataMails1 = []
const dataMails2 = []
const dataMails3 = []
const dataMails4 = []
const dataMails5 = []
const dataMails6 = []
if (PWA) {
        if (Moneda == "Pesos Argentinos") {
            const PA = parseInt(PWAS1) * parseInt(PrecioDolar)
            sumar.push(PA)
            dataMails1.push(`    
            Modulo PWA: $ ${PA}
            `)
        } else {
            sumar.push(PWAS1)
            dataMails1.push(`    
            Modulo PWA: $ ${PWAS1}
            `)
        }
    }
else{
        dataMails1.push(`    
        Modulo PWA no solicitado
        `)
    }
if (Estadisticas) {
    if (Moneda == "Pesos Argentinos") {
        const PA = parseInt(Estadisticas1) * parseInt(PrecioDolar)
        sumar.push(PA)
        dataMails2.push(`    
        Modulo Estadisticas & consulta BD: $ ${PA}
        `)
    } else {
        sumar.push(Estadisticas1)
        dataMails2.push(`    
        Modulo Estadisticas & consulta BD: $ ${Estadisticas1}
        `)
    }
}
else{
    dataMails2.push(`    
    Modulo Estadisticas & consulta BD no solicitado
    `)
}
if (pasarelaPagos) {
    if (Moneda == "Pesos Argentinos") {
        const PA = parseInt(pasarelaPagos1) * parseInt(PrecioDolar)
        sumar.push(PA)
        dataMails3.push(`
        Modulo pasarela de pagos: $ ${PA}
        `)
    } else {
        sumar.push(pasarelaPagos1)
        dataMails3.push(`    
        Modulo pasarela de pagos: $ ${pasarelaPagos1}
        `)
    }
}
else{
    dataMails3.push(`    
    Modulo pasarela de pagos no solicitado
    `)
}
if (clouding) {
    if (Moneda == "Pesos Argentinos") {
        const PA = parseInt(clouding1) * parseInt(PrecioDolar)
        sumar.push(PA)
        dataMails4.push(`    
        Modulo clouding: $ ${PA}
        `)
    } else {
        sumar.push(clouding1)
        dataMails4.push(`    
        Modulo clouding: $ ${clouding1}
        `)
    }
}
else{
    dataMails4.push(`    
    Modulo clouding no solicitado
    `)
}
if (traking) {
    if (Moneda == "Pesos Argentinos") {
        const PA = tracking1 * PrecioDolar
        sumar.push(PA)
        dataMails5.push(`    
        Modulo tracking: $ ${PA}
        `)
    } else {
        sumar.push(tracking1)
        dataMails5.push(`    
        Modulo tracking: $ ${tracking1}
        `)
    }
}
else{
    dataMails5.push(`    
    Modulo tracking no solicitado
    `)
}
if (CiberSeg) {
    if (Moneda == "Pesos Argentinos") {
        const PA = ciberSeg1 * PrecioDolar
        sumar.push(PA)
        dataMails6.push(`    
        Modulo ciber seguridad: $ ${PA}
        `)
    } else {
        sumar.push(ciberSeg1)
        dataMails6.push(`    
        Modulo ciber seguridad: $ ${CiberSeg1}
        `)
    }
}
else{
    dataMails6.push(`    
    Modulo ciber seguridad no solicitado
    `)
}

const PrecioFinalHora = sumar.reduce((a, b) => a + b, 0);
const presio1 = (parseInt(PrecioFinalHora))
const ar = []
// suma1 es para enviar por mails

const modulos = sumar.length

if (Moneda == "Pesos Argentinos") {
    const PrecioArg = (parseInt(presio1) * parseInt(PrecioDolar))
        // para enviar por mails a suma1
    ar.push(PrecioArg)
    console.log("Entro por precios en pesos argentinos", PrecioArg)
    const PreciociberSeg1      = (parseInt(PrecioDolar) * parseInt(ciberSeg1))
    const PrecioPWAS1          = (parseInt(PrecioDolar) * parseInt(PWAS1))
    const Precioclouding1      = (parseInt(PrecioDolar) * parseInt(clouding1))
    const Preciotracking1      = (parseInt(PrecioDolar) * parseInt(tracking1))
    const PreciopasarelaPagos1 = (parseInt(PrecioDolar) * parseInt(pasarelaPagos1))
    const PrecioEstadisticas1  = (parseInt(PrecioDolar) * parseInt(Estadisticas1))

    // verifica si tiene modulos o no para renderizar lo mismo
    if (modulos >= 2 ) {
        const siMod = true
        res.render('partials/cotisSoftFactory/cotiAppiRes', {token, pesosArg,siMod,fechaContact,tipoCont,Obs,PrecioEstadisticas1,PreciopasarelaPagos1,Preciotracking1,Precioclouding1,PrecioPWAS1,PreciociberSeg1,sumar, data, PrecioArg});
        // Guarda en BD
        const guardarCoti = new cotizaciones ({Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,desarrollo,pesosArg,siMod,fechaContact,tipoCont,Obs,PrecioEstadisticas1,PreciopasarelaPagos1,Preciotracking1,Precioclouding1,PrecioPWAS1,PreciociberSeg1,sumar, data, PrecioArg})
        await guardarCoti.save()
    }
    else{
        const siMod = false
        res.render('partials/cotisSoftFactory/cotiAppiRes',{token, pesosArg,siMod,fechaContact,tipoCont,Obs,sumar, data, PrecioArg});
        // Guarda en BD
        const guardarCoti = new cotizaciones ({Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,desarrollo,pesosArg,siMod,fechaContact,tipoCont,Obs,PrecioEstadisticas1,PreciopasarelaPagos1,Preciotracking1,Precioclouding1,PrecioPWAS1,PreciociberSeg1,sumar, data, PrecioArg})
        await guardarCoti.save()
        
    }
// es en dolares
} else {
    ar.push(presio1)
    const PreciociberSeg1      = parseInt(ciberSeg1)
    const PrecioPWAS1          = parseInt(PWAS1)
    const Precioclouding1      = parseInt(clouding1)
    const Preciotracking1      = parseInt(tracking1)
    const PreciopasarelaPagos1 = parseInt(pasarelaPagos1)
    const PrecioEstadisticas1  = parseInt(Estadisticas1)
    // 
    console.log("Entro por precios en dolares", presio1)
    // verifica si tiene modulos o no para renderizar lo mismo
    if (modulos >= 2 ) {
        const siMod = true
        res.render('partials/cotisSoftFactory/cotiAppiRes', {token, desarrollo,pesosArg,siMod,fechaContact,tipoCont,Obs,PrecioEstadisticas1,PreciopasarelaPagos1,Preciotracking1,Precioclouding1,PrecioPWAS1,IOT,PreciociberSeg1,sumar,presio1, data});
        // Guarda en BD
        const guardarCoti = new cotizaciones ({Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,desarrollo,pesosArg,siMod,fechaContact,tipoCont,Obs,PrecioEstadisticas1,PreciopasarelaPagos1,Preciotracking1,Precioclouding1,PrecioPWAS1,IOT,PreciociberSeg1,sumar,presio1})
        await guardarCoti.save()
    }
    else{
        const siMod = false
        res.render('partials/cotisSoftFactory/cotiAppiRes',{token,pesosArg,IOT,siMod,fechaContact,tipoCont,Obs,sumar, data, presio1});
        // Guarda en BD
        const guardarCoti = new cotizaciones ({Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda,desarrollo,pesosArg,IOT,siMod,fechaContact,tipoCont,Obs,sumar, data, presio1})
        await guardarCoti.save()
        
    }
}
const suma1 = ar[0]
    // envia por mail la cotizacion
const contentHTML = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
<input type="image" src="images/fondoempresas.jpg" alt="" style="margin: -2rem000; position: absolute; width: 200%; height: auto;">
<div style="justify-content: center ; align-items: center;">
<p>
<strong>${Nombre}</strong> es un privilegio, para nosotros, poder ser considerados candidatos como proveedores y ayudarlos a lograr sus objetivos.
    <br>
    TBS es una compañía dedicada a la creación de soluciones en el campo de tecnologías de la información. Contamos con talento de alto valor, con experiencia y constantemente actualizados sobre las últimas tecnologías con el fin de brindar el mejor servicio. 
    <br>
    Por tres meses o un año, por un solo recurso o un equipo completo, ofrecemos los mejores recursos con experiencia directa en su industria y con los sistemas y tecnologías que necesita, asi que nuevamente, gracias por elegirnos, como socio tecnológico, a la hora de abordar sus proyectos.
</p>
</div>
<div class="" style="text-align: left; align-items: left;">
<h4>Datos:</h4>
<p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
<p><strong>Empresa:</strong> ${Empresa}  <span></span><strong>Email de contacto:</strong> ${Email}</p>
<p><strong> Moneda de facturacion:</strong> ${Moneda}</p>
Esta pre-cotizacion carece de responsabilidad contractual entre las partes. Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
<br>
<p>
    Tipo de desarrollo: <strong>${desarrollo}</strong> 
    <br>
Modulos extras:
</p
<ul>
<li>
    <p>
    ${dataMails1}
    </p>
</li>
<li>
    <p>
    ${dataMails2}
    </p>
</li>
<li>
    <p>
    ${dataMails3}
    </p>
</li>
<li>
    <p>
    ${dataMails4}
    </p>
</li>
<li>
    <p>
    ${dataMails5}
    </p>
</li>
<li>
    <p>
    ${dataMails6}
    </p>
</li>
</ul>
<br>
El precio inicial es de un <strong>Valor total: ${Moneda}: ${suma1} </strong>.
<br>
<br>
Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
<br>
consulte con su Ejecutivo de cuentas asignado todas las cuestiones tecnicas y dudas que tenga asi como bonificasiones.

</div>
    <div style="width: 110%; margin: 0.1rem auto; text-align: center;" class="center">
        <p>*Consulta por importantes descuentos. </p>
        <p>*Los precios no incluyen iva ni impuestos.</p>
        <br>
        *Nuesto Ejecutivo de Cuentas se pondrá en contacto con usted en la fecha y el horario que nos indico
        <br>
        <br>
        Fecha de contacto: ${fechaContact} de la ciudad de: ${Ciudad}  Tipo de contacto:  ${tipoCont}
        <br>    
        Observaciones:
        <br>
        ${Obs}
        <br>
    </div>
    <br>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
</div>
</div>
</div>
</body>
                    </html>`;
const cotiEntro = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
<div style="justify-content: center ; align-items: center;">
<p>
    Entro el siguiente pedido de cotizacion de: ${Empresa}
</p>
</div>
<div class="" style="text-align: left; align-items: left;">
<h4>Datos:</h4>
<p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
<p><strong>Empresa:</strong> ${Empresa}  <span></span><strong>Email de contacto:</strong> ${Email}</p>
<p><strong> Moneda de facturacion:</strong> ${Moneda}</p>
<br>
<p>
Tipo de desarrollo: <strong>${desarrollo}</strong> 
<br>
Modulos Extras:
</p
<ul>
<li>
    <p>
    ${dataMails1}
    </p>
</li>
<li>
    <p>
    ${dataMails2}
    </p>
</li>
<li>
    <p>
    ${dataMails3}
    </p>
</li>
<li>
    <p>
    ${dataMails4}
    </p>
</li>
<li>
    <p>
    ${dataMails5}
    </p>
</li>
<li>
    <p>
    ${dataMails6}
    </p>
</li>
</ul>
<br>
<p>
<br>
El precio inicial es de un <strong>Valor total: ${Moneda}: ${suma1} </strong>.
<br>
<br>
    Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
    <br>
    consulte con su Ejecutivo de cuentas asignado todas las cuestiones tecnicas y dudas que tenga asi como bonificasiones.
    <br>
    Ponte en contacto con el cliente en el horario que el solicito y logra cerrar una propuesta formal averiguando sus nececidades descubriendo nuevas, sus puntos de dolor. Tambien ponte en contacto con tu lider y acuerden una estrategia y propuesta formal que se envia con copia a tu lider e incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
</p>
</div>   
    <div style="width: 110%; margin: 0.1rem auto; text-align: center;" class="center">
        <p>*Consulta por importantes descuentos. </p>
        <p>*Los precios no incluyen iva ni impuestos.</p>
        <br>
        *Deberas ponerte en contacto con el cliente en la fecha y el horario que nos indico.
        <br>
        <br>
        Fecha de contacto: ${fechaContact} de la ciudad de: ${Ciudad}  Tipo de contacto:  ${tipoCont}
        <br>    
        Observaciones:
        <br>
        ${Obs}
        <br>
    </div>
    <br>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
</div>
</div>
</div>
</body>
</html>`;
                    
    // con EL MAIL DEL CLIENTE ADMINISTRADO POR Hostinger
    const email = "tbs-it.info@tbs-it.net"
    const senderMail = email

    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "tbs-it.info@tbs-it.net",
            pass: "Sebatbs@22",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    const transporter1 = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "tbs-it.info@tbs-it.net",
            pass: "Sebatbs@22",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });
   

    let conAdjunto = {
        from: senderMail, // sender address,
        to: Email,
        subject: "Hola"  + ' ' + Nombre  + ' ' + "TBS IT te envío una pre cotizacion",
        html:contentHTML ,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };
    let alaEmpresa = {
        from: senderMail, // sender address,
        to: Email,
        subject: "Enhorabuena!!! entro una nueva cotizacion de" + ' ' + Empresa  + ' ' ,
        html: cotiEntro,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };
    transporter.sendMail(conAdjunto, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
    transporter1.sendMail(alaEmpresa, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })

});

// Calculo de cotizacion custom software
router.post('/EnviarCotizacion/CustomSoft', [validador1],async (req, res) => {
    const {custom,sofObjetivo,RubroEmp, tecnoFrontend,tecnoBackend,fechaContact,tipoCont,Obs,CustomSoft,appirestFull,IOT,Email,SD,pw,PWA,Estadisticas,pasarelaPagos,clouding,traking,CiberSeg,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda} = req.body
    const siMod1 = true
    const mod = []

    if (PWA == 'on'||Estadisticas == 'on'||pasarelaPagos == 'on'||clouding == 'on'||traking == 'on'||CiberSeg == 'on') {
        mod.push(siMod1)
    }
    const siMod = mod[0]
    const sumar   = []

// preparacion de datos y envio del mails

// dato para los mails
const dataMails1 = []
const dataMails2 = []
const dataMails3 = []
const dataMails4 = []
const dataMails5 = []
const dataMails6 = []

if (PWA) {
    dataMails1.push(`    
    El modulo PWA fue solicitado
    `)    
    }
else{
    dataMails1.push(`    
    Modulo PWA no solicitado
    `)
    }
    if (Estadisticas) {
        dataMails2.push(`    
        Modulo Estadisticas & consulta BD fue solicitado
        `)    
        }
    else{
        dataMails2.push(`    
        Modulo Estadisticas & consulta BD no fue solicitado
        `)
    }

    if (pasarelaPagos) {
        dataMails3.push(`    
        Modulo pasarela de pagos fue solicitado
        `)    
        }
    else{
        dataMails3.push(`    
        Modulo pasarela de pagos no fue solicitado
        `)
    }

if (clouding) {
    dataMails4.push(`    
    Modulo clouding & serverless fue solicitado
    `)    
    }
else{
    dataMails4.push(`    
    Modulo clouding & serverless no fue solicitado
    `)
}

if (traking) {
    dataMails5.push(`    
    Modulo traking fue solicitado
    `)    
    }
else{
    dataMails5.push(`    
    Modulo traking no fue solicitado
    `)
}

if (CiberSeg) {
    dataMails6.push(`    
    Modulo ciber seguridad fue solicitado
    `)    
    }
else{
    dataMails6.push(`    
    Modulo ciber seguridad no fue solicitado
    `)
}

    const data = {custom,siMod,sofObjetivo,RubroEmp,tecnoFrontend,tecnoBackend,fechaContact,tipoCont,Obs,CustomSoft,appirestFull,IOT,Email,SD,pw,PWA,Estadisticas,pasarelaPagos,clouding,traking,CiberSeg,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda}
    console.log("que llega a calculo / EnviarCotizacion CUSTOM SOFT",data)
    res.render('partials/cotisSoftFactory/cotiCustom', {data});
    // Guarda en BD
    const desarrollo = ["Custom Software Factory"]
    const guardarCoti = new cotizaciones ({desarrollo,custom,siMod,sofObjetivo,RubroEmp,tecnoFrontend,tecnoBackend,fechaContact,tipoCont,Obs,CustomSoft,appirestFull,IOT,Email,SD,pw,PWA,Estadisticas,pasarelaPagos,clouding,traking,CiberSeg,pesosArg,Nombre,Apellido,Ciudad,NumCel,Empresa,PagWeb,Moneda})
    const ID = guardarCoti._id
    await guardarCoti.save()
    

    // envia por mail la cotizacion

    // configura mensaje del mail
const contentHTML = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
<input type="image" src="images/fondoempresas.jpg" alt="" style="margin: -2rem000; position: absolute; width: 200%; height: auto;">
<div style="justify-content: center ; align-items: center;">
<p>
<strong>${Nombre}</strong> Entro esta cotizacion custom software factory
</p>
</div>
<div class="" style="text-align: left; align-items: left;">
<h4>Datos:</h4>
<p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
<p><strong>Empresa:</strong> ${Empresa}  <span></span><strong>Email de contacto:</strong> ${Email}</p>
<p><strong> Moneda de facturacion:</strong> ${Moneda}</p>
Esta pre-cotizacion carece de responsabilidad contractual entre las partes. Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
<br>
<p>
<p><strong>Tipo de desarrollo:</strong> ${desarrollo}</p>
<div class="flexlado">
    <p> <strong>Tecnologias elegidas:</strong>
        <br>
        Backend: ${tecnoBackend}
        <br>
        Frontend: ${tecnoFrontend}
        <br>
        Uso destinado del software: ${sofObjetivo}
        <br>
        Rubro de la empresa: ${RubroEmp}
        <br>
    </p>
</div>
<p>
    <strong>Modulos extras:</strong>
</p
<ul>
    <li>
        <p>
        ${dataMails1}
        </p>
    </li>
    <li>
        <p>
        ${dataMails2}
        </p>
    </li>
    <li>
        <p>
        ${dataMails3}
        </p>
    </li>
    <li>
        <p>
        ${dataMails4}
        </p>
    </li>
    <li>
        <p>
        ${dataMails5}
        </p>
    </li>
    <li>
        <p>
        ${dataMails6}
        </p>
    </li>
</ul>
<div class="">
    <p> <strong> Propuesta Comercial </strong>
    <br>
    Te proponemos juntarnos personalmente o en una meet para conocernos y saber mas de usted/es y su proyecto. De esta forma podremos acercar las partes a una propuesta superadora que nos conforme a ambos.
    <br>
    Nos encontramos en la fecha y horario convenido.
    </p>
    </div>
</div>
    <div style="width: 110%; margin: 0.1rem auto; text-align: center;" class="center">
        *Ponte en contacto con el cliente en la fecha y el horario que nos indico
        <br>
        <br>
        Fecha de contacto: ${fechaContact} de la ciudad de: ${Ciudad}  Tipo de contacto:  ${tipoCont}
        <br>    
        Observaciones:
        <br>
        ${Obs}
        <br>
    </div>
    <br>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
</div>
</div>
</div>
</body>
                    </html>`;
const cotiEntro = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
<input type="image" src="images/fondoempresas.jpg" alt="" style="margin: -2rem000; position: absolute; width: 200%; height: auto;">
<div style="justify-content: center ; align-items: center;">
<p>
<strong>${Nombre}</strong> es un privilegio, para nosotros, poder ser considerados candidatos como proveedores y ayudarlos a lograr sus objetivos.
    <br>
    TBS es una compañía dedicada a la creación de soluciones en el campo de tecnologías de la información. Contamos con talento de alto valor, con experiencia y constantemente actualizados sobre las últimas tecnologías con el fin de brindar el mejor servicio. 
    <br>
    Por tres meses o un año, por un solo recurso o un equipo completo, ofrecemos los mejores recursos con experiencia directa en su industria y con los sistemas y tecnologías que necesita, asi que nuevamente, gracias por elegirnos, como socio tecnológico, a la hora de abordar sus proyectos.
</p>
</div>
<div class="" style="text-align: left; align-items: left;">
<h4>Datos:</h4>
<p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
<p><strong>Empresa:</strong> ${Empresa}  <span></span><strong>Email de contacto:</strong> ${Email}</p>
<p><strong> Moneda de facturacion:</strong> ${Moneda}</p>
Esta pre-cotizacion carece de responsabilidad contractual entre las partes. Todos los precios son tentativos, estan sujetos a una negociasion final y a la presentacion de una propuesta formal que incluye: NDA, SLA´s condiciones comerciales, garantias, seguros, forma de pagos y descuentos convenidos.
<br>
<p>
<p><strong>Tipo de desarrollo:</strong> ${desarrollo}</p>
<div class="flexlado">
    <p> <strong>Tecnologias elegidas:</strong>
        <br>
        Backend: ${tecnoBackend}
        <br>
        Frontend: ${tecnoFrontend}
        <br>
        Uso destinado del software: ${sofObjetivo}
        <br>
        Rubro de la empresa: ${RubroEmp}
        <br>
    </p>
</div>
<p>
    <strong>Modulos extras:</strong>
</p
<ul>
    <li>
        <p>
        ${dataMails1}
        </p>
    </li>
    <li>
        <p>
        ${dataMails2}
        </p>
    </li>
    <li>
        <p>
        ${dataMails3}
        </p>
    </li>
    <li>
        <p>
        ${dataMails4}
        </p>
    </li>
    <li>
        <p>
        ${dataMails5}
        </p>
    </li>
    <li>
        <p>
        ${dataMails6}
        </p>
    </li>
</ul>
    <div class="">
        <p>
            <strong> Propuesta Comercial </strong>
            <br>
            Te proponemos juntarnos personalmente o en una meet para conocernos y saber mas de usted/es y su proyecto. De esta forma podremos acercar las partes a una propuesta superadora que nos conforme a ambos.
            <br>
            Nos encontramos en la fecha y horario convenido.
        </p>
    </div>
    <br>
        Consulte con su Ejecutivo de cuentas asignado todas las cuestiones tecnicas y dudas que tenga asi como bonificasiones.
</div>

    <div style="width: 110%; margin: 0.1rem auto; text-align: center;" class="center">
        *Nuesto Ejecutivo de Cuentas se pondrá en contacto con usted en la fecha y el horario que nos indico
        <br>
        <br>
        Fecha de contacto: ${fechaContact} de la ciudad de: ${Ciudad}  Tipo de contacto:  ${tipoCont}
        <br>    
        Observaciones:
        <br>
        ${Obs}
        <br>
    </div>
    <br>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;" hidden><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
</div>
</div>
</div>
</body>
                    </html>`;
                    
    
    // con EL MAIL DEL CLIENTE ADMINISTRADO POR Hostinger
    const email = "tbs-it.info@tbs-it.net"
    const senderMail = email

    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "tbs-it.info@tbs-it.net",
            pass: "Sebatbs@22",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    const transporter1 = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "tbs-it.info@tbs-it.net",
            pass: "Sebatbs@22",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    let conAdjunto = {
        from: senderMail, // sender address,
        to: Email,
        subject: "Hola"  + ' ' + Nombre  + ' ' + "TBS IT te envío una pre cotizacion",
        html:cotiEntro ,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };
    let alaEmpresa = {
        from: senderMail, // sender address,
        to: Email,
        subject: "Enhorabuena!!! entro una nueva cotizacion de" + ' ' + Empresa  + ' ' ,
        html: contentHTML,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };
    transporter.sendMail(conAdjunto, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
    transporter1.sendMail(alaEmpresa, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
});

//***************CONTACTO************************************************************* */

// Calculo de cotizacion custom software
router.post('/contacto',async (req, res) => {

    const {names, apellido, message, email, pais} = req.body
    console.log("te llego el mensaje", req.body)
    req.flash('error', 'Gracias por tu mensaje te responderemos a la brevedad')
    res.redirect("/")

    // envia mail
const cotiEntro = `<html>
<body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
<div style="justify-content: center ; align-items: center;">
<img style="z-index:99999999999999999999999999999 !important; width:80%; height:55%;"src="https://tbs-it.net/logo">
    <p>
        <strong>Entro un nuevo mensaje/consulta</strong>
    </p>
</div>
<div class="" style="text-align: left; align-items: left;">
    <h4>Datos:</h4>
    <p><strong>Nombre:</strong> ${names}  <span></span><strong>Apellido:</strong> ${apellido}</p> 
    <p><strong>Email de contacto:</strong> ${email}</p>
    <p><strong> Pais:</strong> ${pais}</p>
    <p><strong>Mensaje:</strong></p>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;">
        <h6>
            ${message}
        <h6>
    </div>
</div>
    <br>
    <div style="text-align: center; padding: 0.5rem; background:lightgray; border-radius: 1.5rem;"><h6>This message has been generated automatically by "TBS" for a user/client acomplish whit international rules of mailing services and tbs we are not responsible under any type of exception for its content or intentions. This mail is intended exclusively for its recipient and may contain privileged or confidential information. If you are not the intended recipient, you are notified that unauthorized use, disclosure and/or copying is prohibited under current legislation. If you have received this message by mistake, we ask you to notify us immediately by this same means and proceed to its destruction..</h6><div><span></span><a href="http://tbsit.co">
    </div>
</body>
</html>`;
    // con EL MAIL DEL CLIENTE ADMINISTRADO POR GOOGLE
    const senderMail = "tbs-it.info@tbs-it.net"
    
    const transporter5 = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "tbs-it.info@tbs-it.net",
            pass: "Sebatbs@22",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    let conAdjunto = {
        from: senderMail, // sender address,
        to: senderMail,
        subject: "Hola, llego un nuevo mensaje",
        html:cotiEntro ,
        // attachments: [
        //   {   // file on disk as an attachment
        //       filename: nombreAdjunto,
        //       path: datosAdjuntados[0]
        //   },
        // ]
    };

    transporter5.sendMail(conAdjunto, (er,info)=>{
        if(er){
        console.log("error",er)
        }else{
            console.log("info",info) 
        }
    })
    // guarda en BD
    const guardarMess = new mensajes ({ names, apellido, message, email, pais })
    await guardarMess.save();
});


//Ruta para llegar al Signin
router.get('/logo', async (req, res) => {
    console.log('Llego a /logo')
    res.render('partials/img/logo')
});

module.exports = router;  