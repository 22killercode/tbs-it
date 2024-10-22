require('dotenv').config();
const { Router } = require('express');
const router     = Router();
const nodemailer = require('nodemailer');
const path       = require('path')//no sacar
const passport   = require('passport'); 

//models
const User         = require('../models/User');
const cotiStaffing = require('../models/cotiStaffing');
const cotizaciones = require('../models/cotizaciones');
const talentos     = require('../models/talentos');

//midlewears
const {validador1,val2,cheqpass} = require('../routes/Midlewares');
const shortid                    = require('shortid');

// // ruta para ingresar
// router.post('/users/signin22', passport.authenticate('local',
//     {
//         successRedirect: '/entraraOpciones',//notes
//         failureRedirect: '/users/noestasRegistrado',
//         failureFlash: true
//     }
// ));

router.post('/users/signin', (req, res) => {

res.redirect("/entraraOpciones")
});


// ruta que te envia a opciones de los usuarios 
router.get('/entraraOpciones',  [], async (req, res) => {
    
    // buscar quien es y asignarle un status y enviarlo
    const id    = req.user.id
    const user1 = await User.findById({_id:id})
    const cat   = user1.catego
    if (cat == "CEO") {
        // busca las precotis cotizaciones y lo de RRHH
        const precots    = await cotiStaffing.find()
        const totalCotis = await cotizaciones.find()
        const talent     = await talentos.find()
        const precot     = precots.length
        // averiguamos que tipo de cotis son
        const cotiSt     = []
        const cotiPW     = []
        const cotiIOT    = []
        const cotiCus    = []
        for (const a1 of totalCotis) {
            const staffing  = a1.talents.length
            const PW  = a1.PW
            const IOT = a1.IOT
            const CUS = a1.CUS
            if (staffing >= 1) {
                cotiSt.push(staffing)
            }
            // cotis de PW
            if (PW) {
                cotiPW.push(1)
            }
            // cotis de PW
            if (IOT) {
                cotiIOT.push(1)
            }
            // cotis de PW
            if (CUS) {
                cotiCus.push(1)
            }
        }
// hacer las sumatorias d elos arrays de cada tipo de coti
// const cotiStaf   = cotiSt[0] hace rla sumatria del array

const prog    = talent.length
        const part    = talent.length
        const CEO = true
        console.log("/entraraOpciones",{id,user1, precot,cotiSt})
        res.render('partials/Usuarios/Opciones',{ id, CEO, precot,cotiStaf, prog, part});
    }else{
        console.log("/entraraOpciones por false no hay ceo",{id,user1})
        res.render('partials/Usuarios/Opciones',{id});
    }
});

// ruta que te indica que no estas logeado
router.get('/users/noestasRegistrado', async (req, res) => {
    console.log("/users/noestasRegistrado")
    req.flash('error','No estas registrad@, ponte en contacto con tu administrador o ejecutivo de cuentas.');
    res.redirect('/')
});

// ruta para inscribirte
router.get('/inscribirme22', async (req, res) => {
    console.log("/inscribirme")
    res.render('partials/Usuarios/inscribirme');
});

// ruta olvide mi passsword
router.get('/olvidemipassword', async (req, res) => {
    console.log("/olvidemipassword")
    res.render('partials/Usuarios/Olvidemipassword');
});

// ruta para comabiar el password
router.post('/cambiar/password', async (req, res) => {
    console.log("/cambiar/password", req.body)
    req.flash('success_msg', 'Gracias, se estará comunicando un representante con usted');
    res.redirect('/');
});


// ruta que te envia a opciones de los usuarios 
router.post('/signUp', async (req, res) => {
    console.log("/signUp",req.body)
    const { name, tyc, apellido, email, password, confirm_password, numCel, catego } = req.body;
    console.log('que llega al Req. Body', req.body)

    const errors = [];
    if (name.length <= 0) {
        errors.push({ text: 'Coloque su nombre' });
    }
    if (apellido.length <= 0) {
        errors.push({ text: 'Coloque su apellido' });
    }
    if (numCel.length <= 0) {
        errors.push({ text: 'Coloque su numero celular' });
    }
    if (email.length <= 0) {
        errors.push({ text: 'Coloque su mail' });
    }
    if (catego.length <= 0) {
        errors.push({ text: 'Ingrese la categoria del inscripto' })
    }
    if (!tyc) {
        errors.push({ text: 'Terminos y Condiciones' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'No coinciden los password' });
    }
    if (password.length < 8) {
        errors.push({ text: 'Su password debe tener mas de 8 caracteres alfanumericos' })
    }
    if (errors.length > 0) {
        res.render('partials/Usuarios/inscribirme', { errors, name,  tyc, apellido, email, password, confirm_password });
        req.flash('error', 'errors.');
    } else {
        // Look for email coincidence
        const cheqMail = await User.findOne({email:email});
        if (cheqMail) {
            res.render('partials/Usuarios/inscribirme', { errors, catego, name,  tyc, apellido, email, password, confirm_password });
            req.flash('error', 'Este email ya esta en uso.');
        } else {
            const nroCliEmp = shortid.generate(); 
            const fecha = new Date()
            const statusInscrip = 'incompleto'
            const usuarioBloqueado = false
            const newUser = new User({usuarioBloqueado, name, tyc, apellido, statusInscrip, email, password,catego });
            newUser.password = await newUser.encryptPassword(password);
            //newUser.password = (password+newUser._id)
            await newUser.save();
            req.flash('success_msg', 'Revise su mail ingresado, su Correo no deseado o Spam o Tambien para registarse rapidamente puede continuar presionando "Ingresar" y luego coloque su mail y contraseña.');
            res.redirect('/');
        }
    }
});


// ruta que te envia a opciones de los usuarios 
router.get('/probando1', async (req, res) => {
    console.log("/entraraOpciones")
    res.render('partials/cotisSoftFactory/cotipagWeb');
});


module.exports = router;