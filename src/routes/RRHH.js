require('dotenv').config();
const express           = require('express');
const router            = express.Router(); 
const passport          = require('passport');
const mimeTypes        = require('mime-types')
const multer           = require('multer')
const path             = require('path')//no sacar
const fs               = require('fs').promises

//midlewears
const {validador1,val2} = require('../routes/Midlewares');

//appis
const nodemailer        = require('nodemailer');
const shortid           = require('shortid');

//models 
const Tokens   = require('../models/Tokens');
const talentos = require('../models/talentos');



//*********RECURSOS HUMANOS***************************************************************** */

//ruta para entrar al cuestinario de partners
router.get('/quieroserunpartner', async (req, res) => {
    res.render('partials/RRHH/Partners');
});

//ruta para entrar al cuestinario de programadores
router.get('/quierotrabajarentbs',async (req, res) => {
    res.render('partials/RRHH/programadores');
});

//obtiene los datos enviados por el programador
router.post('/dataTalento',async (req, res) => {
    const {Nombre, Apellido, NumCel, Email, senority, nivelIngles, MonedaCobro, PaisResi, CiudadResi, Empresa, ModTrab, linke,tecnoBackend, tecnoFrontend} = req.body;
    const {Archivo} = req.files;
    const nombreAdjunto = []
    console.log("que llega data Talentoooooooooooooooooooooo",req.body,  req.files)
    if(!req.files || Object.keys(req.files).length === 0  ) { 
        res.status(400).json({msg:'No se subio ningun archivo'});
        req.flash('error', 'Debe subir un CV con extension .PDF o .Word')
        res.render('partials/RRHH/programadores');
    }else{
            const nombreCorto = Archivo.name.split('.');
            const extension = nombreCorto[nombreCorto.length - 1]
            const extValidas = ['pdf', 'word', 'doc', 'docx','txt', 'ppt']
            //validacion de extensiones
        if (extValidas.includes(extension)) {
                const errors = [];
                if (!Archivo) {
                    errors.push({ text: 'Incluya su CV en .pdf o .word' });
                }
                if (Nombre.length <= 0) {
                    errors.push({ text: 'Coloque su nombre' });
                }
                if (Apellido.length <= 0) {
                    errors.push({ text: 'Coloque su apellido' });
                }
                if (NumCel.length <= 0) {
                    errors.push({ text: 'Coloque su numero celular' });
                }
                if (Email.length <= 0) {
                    errors.push({ text: 'Coloque su mail' });
                }
                if (MonedaCobro.length <= 0) {
                    errors.push({ text: 'Incluya que tipo de moneda prefiere' });
                }
                if (senority.length <= 0) {
                    errors.push({ text: 'Agregue su senority' });
                }
                if (nivelIngles.length <= 0) {
                    errors.push({ text: 'Agregue su nivel de ingles' });
                }
                if (PaisResi.length <= 0) {
                    errors.push({ text: 'Agregue su país de residencia' });
                }
                if (CiudadResi.length <= 0) {
                    errors.push({ text: 'Agregue su ciudad de residencia' });
                }
                if (ModTrab.length <= 0) {
                    errors.push({ text: 'Agregue su preferencia de trabajo' });
                }
                if (tecnoBackend.length <= 0) {
                    errors.push({ text: 'Agregue su tecnologia backend' });
                }
                if (tecnoFrontend.length <= 0) {
                    errors.push({ text: 'Agregue su tecnologia frontend' });
                }
                if (errors.length > 0) {
                    req.flash('errors', errors);
                    res.redirect('/quierotrabajarentbs');
//                    console.log("cuantos errores encontro?",errors);
                } else {
                    const idAdjunto     = shortid.generate();
                    const idAdjCompleto = (idAdjunto + '.' + extension)
                    console.log('cual es el id idData y del adjunto CVS',idAdjCompleto)
                    // sube el archivo al servidor
                    const uploadPath = path.join (__dirname, '../../uploads/Cvs', idAdjCompleto);
                    Archivo.mv(uploadPath,async (err)=>{
                        if (err){
                        return console.log(err);  
                        }
                    });
                res.render('partials/RRHH/validadorRRHH',{Nombre, Email});
                // guardar en BD
                const portfolio = []
                const guardar   = new talentos ({Nombre, Apellido, NumCel, Email, senority, nivelIngles, MonedaCobro, PaisResi, CiudadResi, Empresa, ModTrab, linke,tecnoBackend, tecnoFrontend, uploadPath, portfolio})
                guardar.save()
                // enviar mail para validacion
                //Genera Token de seguridad en BD
                const token = shortid.generate()
                const guardarToken = new Tokens ({ token })
                await guardarToken.save()
                const contentHTML = `<html>
                <body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
                <div style="justify-content: center ; align-items: center;">
                <p>
                <strong>${Nombre}</strong> es un privilegio, para nosotros, que desees trabajar en TBS.
                <br>
                TBS es una compañía dedicada a la creación de soluciones en el campo de tecnologías de la información. Contamos con talentos de gran valor, con experiencia, constantemente capacitados y actualizados sobre las últimas tecnologías con el fin de brindar el mejor servicio. 
                <br>
                <br>
                <strong>Datos con los que te inscribiste:</strong>
                </h4>
                <br>
                <p>
                <p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
                <p><strong>Empresa:</strong> ${PaisResi}  <span></span><strong>Email de contacto:</strong> ${CiudadResi}</p>
                <p><strong>Numero contacto:</strong> ${NumCel}  <span></span><strong>Apellido:</strong> ${Email}</p> 
                <p><strong>Moneda Cobro:</strong> ${MonedaCobro}  <span></span><strong>Nivel de Ingles:</strong> ${nivelIngles}</p>
                <p><strong>Empresa trabaja actualmente:</strong> ${Empresa}  <span></span><strong>Preferencia de trabajo:</strong> ${ModTrab}</p> 
                <p>
                    <strong>Tecnologia Backend:</strong> ${tecnoBackend}  <span></span><strong>Tecnologia Frontend:</strong> ${tecnoFrontend}</p>
                    <strong>Señority:</strong>${senority}   <span></span><span></span><strong>Link pagina web o linkedin:</strong>${linke}</p>
                </p>
                <p>
                Por favor ingresa al link abajo o vuelve a tu pagina web e ingresa el codigo alfanumerico que esta escrito abajo, para validar tus datos y en breve se estara comunicando alguien de nuestro departamento de recruiting para continuar con tu ingreso.
                </p>
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
                const cotiEntro = `<html>
                <body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
                <div style="justify-content: center ; align-items: center;">
                <p>
                Un nuevo candidato que desea trabajar en TBS se inscribio.
                <br>
                Revisa sus datos, ponte en contacto con el reapsen su CV juntos y dale la bienvenida a TBS
                <br>
                </p>
                <h4>
                Datos:
                </h4>
                <br>
                <p>
                <p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
                <p><strong>Empresa:</strong> ${PaisResi}  <span></span><strong>Email de contacto:</strong> ${CiudadResi}</p>
                <p><strong>Numero contacto:</strong> ${NumCel}  <span></span><strong>Apellido:</strong> ${Email}</p> 
                <p><strong>Moneda Cobro:</strong> ${MonedaCobro}  <span></span><strong>Nivel de Ingles:</strong> ${nivelIngles}</p>
                <p><strong>Empresa trabaja actualmente:</strong> ${Empresa}  <span></span><strong>Preferencia de trabajo:</strong> ${ModTrab}</p> 
                <p>
                    <strong>Tecnologia Backend:</strong> ${tecnoBackend}  <span></span><strong>Tecnologia Frontend:</strong> ${tecnoFrontend}</p>
                    <br>
                    <strong>Señority:</strong>${senority}<span></span><strong>Link pagina web o linkedin:</strong>${linke}</p>
                    <br>
                    En adjuntos encotraras su CV, guardalo en la crpeta correspondiente
                </p>

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
                    subject: "Hola"  + ' ' + Nombre  + ' ' + "Valida tu inscripcion a TBS-IT company",
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
                    subject: "Enhorabuena!!! Se inscribio un nuevo talento" + ' ' + Nombre + ' ' + tecnoBackend + ' ' + tecnoFrontend ,
                    html: cotiEntro,
                    attachments: [
                    {   // file on disk as an attachment
                        filename: nombreAdjunto[0],
                        path: uploadPath
                    },
                    ]
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
                // eliminar el adjunto
                setTimeout(async() => {
                fs.unlink(path.join (uploadPath))
                    .then(() => {
                        console.log('File removed')
                    }).catch(err => {
                        console.error('Something wrong happened removing the file', err);
                    });
                },10000);
            }
        }else{
            req.flash('error', 'Su CV debe ser una extension .PDF o .Word')
            res.render('partials/RRHH/programadores');
        }
    };
});

//obtiene los datos enviados por el PARTNER
router.post('/dataPartner',async (req, res) => {
    console.log("funca /dataPartner", req.body)
    const {Nombre, Apellido, NumCel, Email, tipoPartner, nivelIngles, Moneda, PaisResi, CiudadResi, Empresa, ModTrab, linke,tecnoBackend, tecnoFrontend} = req.body;
    const {Archivo} = req.files;
    const nombreAdjunto = []
    //Genera Token de seguridad en BD
    const token = shortid.generate()
    const guardarToken = new Tokens ({ token })
    await guardarToken.save()
    console.log("que llega del partner",req.body,  req.files)
    if(!req.files || Object.keys(req.files).length === 0  ) { 
        req.flash('error', 'Debe subir un CV con extension .PDF o .Word')
        res.render('partials/RRHH/programadores');
    }else{
        const nombreCorto = Archivo.name.split('.');
        const extension = nombreCorto[nombreCorto.length - 1]
        const extValidas = ['pdf', 'word', 'doc', 'docx','txt', 'ppt']
            //validacion de extensiones
            if (extValidas.includes(extension)) {
                const errors = [];
                if (!Archivo) {
                    errors.push({ text: 'Incluya su CV en .pdf o .word' });
                }
                if (Nombre.length <= 0) {
                    errors.push({ text: 'Coloque su nombre' });
                }
                if (Apellido.length <= 0) {
                    errors.push({ text: 'Coloque su apellido' });
                }
                if (NumCel.length <= 0) {
                    errors.push({ text: 'Coloque su numero celular' });
                }
                if (Email.length <= 0) {
                    errors.push({ text: 'Coloque su mail' });
                }
                if (Moneda.length <= 0) {
                    errors.push({ text: 'Incluya que tipo de moneda prefiere' });
                }
                if (tipoPartner.length <= 0) {
                    errors.push({ text: 'Agregue el tipo de partner que desea ser' });
                }
                if (nivelIngles.length <= 0) {
                    errors.push({ text: 'Agregue su nivel de ingles' });
                }
                if (PaisResi.length <= 0) {
                    errors.push({ text: 'Agregue su país de residencia' });
                }
                if (CiudadResi.length <= 0) {
                    errors.push({ text: 'Agregue su ciudad de residencia' });
                }
                if (ModTrab.length <= 0) {
                    errors.push({ text: 'Agregue su preferencia de trabajo' });
                }
                if (linke.length <= 0) {
                    errors.push({ text: 'Agregue su link de linkedin o pagina web' });
                }
                if (tecnoBackend.length <= 0) {
                    errors.push({ text: 'Agregue su tecnología backend' });
                }
                if (tecnoFrontend.length <= 0) {
                    errors.push({ text: 'Agregue su tecnología frontend' });
                }
                if (errors.length > 0) {
                    req.flash('errors', errors);
                    res.redirect('/quieroserunpartner');
                    // res.render('partials/RRHH/programadores', {Nombre, Apellido, NumCel, Email, senority, nivelIngles, MonedaCobro, PaisResi, CiudadResi, Empresa, ModTrab, linke,tecnoBackend, tecnoFrontend });
                    console.log("cuantos errores encontro?",errors);
                } else {
                    const idAdjunto     = shortid.generate();
                    const idAdjCompleto = (idAdjunto + '.' + extension)
                    console.log('cual es el id idData y del adjunto CVS',idAdjCompleto)
                    // sube el archivo al servidor
                    const uploadPath = path.join (__dirname, '../../uploads/Cvs', idAdjCompleto);
                    Archivo.mv(uploadPath,async (err)=>{
                        if (err){
                        return console.log(err);  
                        }
                    });
                    const partner = true
                    res.render('partials/RRHH/validadorRRHH',{partner,Nombre});
                    
                    // guardar en BD
                    const guardar = new talentos ({partner,Nombre, Apellido, NumCel, Email, tipoPartner, nivelIngles, Moneda, PaisResi, CiudadResi, Empresa, ModTrab, linke,tecnoBackend, tecnoFrontend, uploadPath})
                    guardar.save()

                    // enviar mail para validacion
                    const contentHTML = `<html>
                    <body style="padding:1rem; margin:auto; background:whitesmoke; height:auto; box-shadow:0.2rem 0.4rem 0.7rem 0.7rem black; width:80%; border-radius:1.5rem; color:black; border-top:lightgray 0.2rem solid; border-left:lightgray 0.2rem solid; border-bottom:black 0.4rem solid; border-right:black 0.4rem solid; "font-family:'Times New Roman', Times, serif; white-space:pre-line; word-break:break-all;>
                    <div style="justify-content: center ; align-items: center;">
                    <p>
                    <strong>${Nombre}</strong> es un privilegio, para nosotros, que desees pertenecer al grupo en TBS-IT.
                    <br>
                    TBS es una compañía dedicada a la creación de soluciones en el campo de tecnologías de la información. Contamos con talentos de gran valor, con experiencia, constantemente capacitados y actualizados sobre las últimas tecnologías con el fin de brindar el mejor servicio. 
                    <br>
                    <br>
                    <strong>Datos con los que te inscribiste:</strong>
                    </h4>
                    <br>
                    <p>
                    <p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
                    <p><strong>Empresa:</strong> ${PaisResi}  <span></span><strong>Email de contacto:</strong> ${CiudadResi}</p>
                    <p><strong>Numero contacto:</strong> ${NumCel}  <span></span><strong>Apellido:</strong> ${Email}</p> 
                    <p><strong>Moneda Cobro:</strong> ${Moneda}  <span></span><strong>Nivel de Ingles:</strong> ${nivelIngles}</p>
                    <p><strong>Empresa trabaja actualmente:</strong> ${Empresa}  <span></span><strong>Preferencia de trabajo:</strong> ${ModTrab}</p> 
                    <p>
                        <strong>Tecnologia Backend:</strong> ${tecnoBackend}  <span></span><strong>Tecnologia Frontend:</strong> ${tecnoFrontend}</p>
                        <strong>Tipo de partner:</strong>${tipoPartner}   <span></span><span></span><strong>Link pagina web o linkedin:</strong>${linke}</p>
                    </p>
                    <p>
                    Por favor ingresa al link abajo o vuelve a tu pagina web e ingresa el codigo alfanumerico que esta escrito abajo, para validar tus datos y en breve se estara comunicando alguien de nuestro departamento de recruiting para continuar con tu ingreso.
                    </p>
                        <div style="text-align: center; justify-content: center; background:black; color:white;">
                            <h1>
                                ${token}
                            </h1>
                        </div>
                        <div style="text-align: center; justify-content: center;">
                            <a href="http://dovemailer.net/validadorRRHHs" ><h4>Has click aqui para continuar</h4></a>
                        </div>
                    <div class="" style="text-align: left; align-items: left;">
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
                    Un nuevo candidato a PARTNER que desea trabajar en TBS se inscribio.
                    <br>
                    Revisa sus datos, ponte en contacto con el reapsen su CV juntos y dale la bienvenida a TBS
                    <br>
                    </p>
                    <h4>
                    Datos:
                    </h4>
                    <br>
                    <p>
                    <p><strong>Nombre:</strong> ${Nombre}  <span></span><strong>Apellido:</strong> ${Apellido}</p> 
                    <p><strong>Empresa:</strong> ${PaisResi}  <span></span><strong>Email de contacto:</strong> ${CiudadResi}</p>
                    <p><strong>Numero contacto:</strong> ${NumCel}  <span></span><strong>Apellido:</strong> ${Email}</p> 
                    <p><strong>Moneda Cobro:</strong> ${Moneda}  <span></span><strong>Nivel de Ingles:</strong> ${nivelIngles}</p>
                    <p><strong>Empresa trabaja actualmente:</strong> ${Empresa}  <span></span><strong>Preferencia de trabajo:</strong> ${ModTrab}</p> 
                    <p>
                        <strong>Tecnologia Backend:</strong> ${tecnoBackend}  <span></span><strong>Tecnologia Frontend:</strong> ${tecnoFrontend}</p>
                        <br>
                        <strong>Tipo de partner:</strong>${tipoPartner}<span></span><strong>Link pagina web o linkedin:</strong>${linke}</p>
                        <br>
                        En adjuntos encotraras su CV, guardalo en la crpeta correspondiente
                    </p>

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
    // hostinger
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
                        subject: "Hola"  + ' ' + Nombre  + ' ' + "Valida tu inscripcion a TBS-IT company",
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
                        subject: "Enhorabuena!!! Se inscribio un nuevo talento" + ' ' + Nombre + ' ' + tecnoBackend + ' ' + tecnoFrontend ,
                        html: cotiEntro,
                        attachments: [
                        {   // file on disk as an attachment
                            filename: nombreAdjunto[0],
                            path: uploadPath
                        },
                        ]
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
                    // eliminar el adjunto
                    setTimeout(async() => {
                    fs.unlink(path.join (uploadPath))
                        .then(() => {
                            console.log('File removed')
                        }).catch(err => {
                            console.error('Something wrong happened removing the file', err);
                        });
                    },10000);
                }
            }else{
                req.flash('error', 'Debe ser un archivo PDF o Word')
                res.render('partials/RRHH/Partners');
            }
        };
});

// validador RRHH
router.post('/validarRRHH',[validador1], (req, res) => {
    const{Email} = req.body
    console.log("que llega a validador", req.body)
    if (Email) {
        res.render('partials/RRHH/portfolio',{Email});        
    } else {
        req.flash('success_msg','Gracias por inscribirte nos pondremos en contacto en breve');
        res.render('partials/RRHH/gracias');
    }
});


//ruta para entrar al cuestinario de programadores
router.post('/portfolioTalento',async (req, res) => {
//    console.log("/portfolioTalento", req.body)
    const {Email} = req.body
    res.render('partials/RRHH/portfolio',{Email});
});

//ruta para procesar el cuestinario de programadores
router.post('/portfolioTalentos',async (req, res) => {
    const {Email, link, titulo} = req.body
    const port = await talentos.findOne({Email:Email})
  //  console.log("/portfolioTalentos",req.body,port)
    const portfolio = port.portfolio
    portfolio.push({link, titulo})
    await talentos.findOneAndUpdate({Email:Email}, {portfolio});
    res.render('partials/RRHH/portfolio', {portfolio, Email});
});

// validador RRHH
router.get('/validadorRRHHs', (req, res) => {
    res.render('partials/RRHH/validadorRRHH');
});

// final talentos
router.get('/fintal', (req, res) => {
    req.flash('success_msg','Gracias por inscribirte nos pondremos en contacto en breve');
    res.render('partials/RRHH/gracias');
});


// portfolio empresa
router.get('/portfolioTalentosTBS', async (req, res) => {
    const port = await talentos.find()
    const portfolio = []
    for (const a1 of port) {
        const portfo = a1.portfolio
        for (const a2 of portfo) {
            const titulo = a2.titulo
            const link   = a2.link
            portfolio.push({titulo,link})
        }
        const Nombre = a1.Nombre
        portfolio.push({Nombre})
    }
    console.log("/portfolioTalentosTBS",portfolio)
    res.render('partials/RRHH/PTTBS',{portfolio});
});


module.exports = router