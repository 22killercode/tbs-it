require('dotenv').config();
const express   = require('express');
const router    = express.Router(); 
const webpush = require('web-push');


const http   = require('http');
const server = http.Server(express);

//helpers
const nodemailer = require('nodemailer');

//models
const usuario       = require('../models/User');
const cotiStaffing  = require('../models/cotiStaffing'); 
const cotizaciones  = require('../models/cotizaciones');
const Tokens        = require('../models/Tokens');
const PushMensajes  = require('../models/messages');
const pushMess      = require('../models/pushMes');
const Remitos       = require('../models/remito');
const JSONTransport = require('nodemailer/lib/json-transport');
const { Script } = require('vm');
const PrecioDolar = 450
//Variables
const HorasMes             = 160
//precios TOP USS
const precioBackend        = 55
const precioFrontend       = 50
// descuentos por pais USS
const precioArg            = -25
const precioLatam          = -15
const precioUsaEur         = +5
// descuentos por señority USS
const precioTL             = +20
const precioSemiSenior     = -10
const precioJuniorAdnvance = -15
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
const paginaWeb      = 150
const appiRestFull   = 5000
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


        // guardar el mensaje el pull mensajes
        async function guardarMensajes(dataOwner, dataCliente, mensaje, subjectOwner, subjectCliente, codigoPedido){

            const messageOwner = mensaje.messageOwner;
            const messageCliente = mensaje.messageCliente;
            const nombreComercio = dataOwner.nombreEcommerce;
            const idOwner = dataOwner._id
            const nombreCliente = dataCliente.nombre + "" + dataCliente.apellido
            const idCliente = dataCliente._id

            // Crear objeto para el mensaje del propietario
            const mensajeOwner = new PushMensajes({ messageOwner, nombreCliente, subjectOwner, idOwner, codigoPedido });
            // Guardar el mensaje del propietario en la base de datos
            await mensajeOwner.save();

            // Crear objeto para el mensaje del cliente
            const mensajeCliente = new PushMensajes({ messageCliente, nombreComercio,  subjectCliente, idCliente, codigoPedido });
            // Guardar el mensaje del cliente en la base de datos
            await mensajeCliente.save();
        
        }

        // enviar emails automaticamente
        async function sendMail(dataEnviarEmail) {
            console.log("Datos recibidos en sendMail:", dataEnviarEmail);

            const {transportEmail, reclamo, enviarExcel, emailOwner, emailCliente, numCelCliente, numCelOwner, mensaje, codigoPedido, nombreOwner, nombreCliente, subjectCliente, subjectOwner, otraData,logoOwner, cancelaEnvio, pedidoCobrado} = dataEnviarEmail;

            const cliente = nombreCliente;

            const {pais, estado,localidad,calle,numeroPuerta,CP} = otraData.dataDir
            const dataPedido23 = otraData.dataPedido23

            try {
                // Configuración del transporte de correo
                const transporter2 = nodemailer.createTransport({
                    host: "smtp.hostinger.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "tbs-it.info@tbs-it.net",
                        pass: "Sebatbs@22",
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });

                const transporter = nodemailer.createTransport(transportEmail);

                // Opciones de correo para el propietario del ecommerce
                let mailOptionsOwner = {};
                // Opciones de correo para el cliente
                let mailOptionsCliente = {};

                //aviso dle pedido
                if (pedidoCobrado) {
                    // Generar el HTML para cada producto en el array listaProductos
                    const productosHTML = dataPedido23.listaProductos.map(producto => `
                    <div style="margin-bottom: 20px;">
                        <img src="${producto.imgProd}" alt="${producto.nombreProd}" style="max-width: 100px;">
                        <p><strong>Nombre:</strong> ${producto.nombreProd}</p>
                        <p><strong>Precio:</strong> ${producto.precio}</p>
                        <p><strong>Cantidad:</strong> ${producto.cantidadProductos}</p>
                        <p><strong>Subtotal:</strong> ${producto.subTotalCompra}</p>
                    </div>
                    `).join('');
                    mailOptionsOwner = {
                        from: "tbs-it.info@tbs-it.net",
                        to: ["sebastianpaysse@gmail.com",emailOwner],
                        subject: subjectOwner,
                        html : `
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Nuevo pedido número ${dataPedido23.codigoPedido}</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                        
                            <div style="background-color: #ff6f61; color: #fff; padding: 20px; text-align: center;">
                                <img src="${dataPedido23.logoOwner}" alt="Logo" height="50%" width="50%" style="border-radius: 100%;">
                                <h1 style="margin-bottom: 10px;">¡Nueva Pedido Recibido!</h1>
                                <h2> ¡ATENCIÓN! <br> Tienes un nuevo pedido número código ${dataPedido23.codigoPedido}</h2>
                            </div>
                        
                            <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;"><strong>Mensaje:</strong> ${mensaje.messageOwner}</p>
                                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                                    <strong>Datos del cliente:</strong>
                                    <br>
                                    <strong>Nombre:</strong> ${cliente} <br>
                                    <strong>Email:</strong> ${emailCliente.emailCliente} <br>
                                    <strong>Número de Celular:</strong> ${numCelCliente} <br>
                                    <br>
                                    <strong>Dirección Entrega:</strong>
                                    <br>
                                    <strong>País:</strong> ${pais} <br>
                                    <strong>Estado/Provincia:</strong> ${estado} <br>
                                    <strong>Localidad:</strong> ${localidad}<br>
                                    <strong>Calle:</strong> ${calle}<br>
                                    <strong>Número puerta:</strong> ${numeroPuerta}<br>
                                    <strong>C.P.:</strong> ${CP}<br>
                                    <br>
                                    <strong>Pedido:</strong>
                                    <br>
                                    <strong>Código Pedido:</strong> ${dataPedido23.codigoPedido} <br>
                                    <strong>Fecha:</strong> ${dataPedido23.fecha} <br>
                                    <strong>Nombre Ecommerce:</strong> ${dataPedido23.nombreEcomm} <br>
                                    <strong>Tipo de Pago:</strong> ${dataPedido23.tipoDePago} <br>
                                    <strong>Status de Envío:</strong> ${dataPedido23.statusEnvio} <br>
                                    <strong>Productos:</strong> 
                                    ${productosHTML}
                                </p>
                        
                                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                    <strong>
                                    ¡ATENCIÓN!
                                    <br>
                                    Asegúrate de comunicarte inmediatamente y coordinar la entrega, de resultar algún conflicto al respecto la cuenta sera suspendida.
                                    </strong>
                                </p>
                            </div>
                        
                            <div style="background-color: #ff6f61; color: #fff; padding: 20px; text-align: center;">
                            <p style="font-size: 14px; color: #fff; ">Por favor ponte en contacto con tu cliente a la brevedad o podrá ser objeto de suspension de tu cuenta.</p>
                            </div>
                        
                        </body>
                        </html>
                        `
                    };
                    mailOptionsCliente = {
                        from: "tbs-it.info@tbs-it.net",
                        to: emailCliente,
                        subject: subjectCliente, // Asegúrate de que subjectCliente esté formateado correctamente
                        html : `
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Nuevo pedido número ${dataPedido23.codigoPedido}</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                        
                            <div style="background-color: skyblue; color: #fff; padding: 20px; text-align: center;">
                                <img src="${dataPedido23.logoOwner}" alt="Logo" height="50%" width="50%" style="border-radius: 100%;">
                                <h1 style="margin-bottom: 10px;">¡Se recibió tu pedido!</h1>
                                <h2> ¡ATENCIÓN! <br> Se esta preparando tu pedido número código ${dataPedido23.codigoPedido}</h2>
                            </div>
                        
                            <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;"><strong>Mensaje:</strong> ${mensaje.messageCliente}</p>
                                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                                    <strong>Datos del cliente:</strong>
                                    <br>
                                    <strong>Nombre:</strong> ${cliente} <br>
                                    <strong>Email:</strong> ${emailCliente.emailCliente} <br>
                                    <strong>Número de Celular:</strong> ${numCelCliente} <br>
                                    <br>
                                    <strong>Dirección Entrega:</strong>
                                    <br>
                                    <strong>País:</strong> ${pais} <br>
                                    <strong>Estado/Provincia:</strong> ${estado} <br>
                                    <strong>Localidad:</strong> ${localidad}<br>
                                    <strong>Calle:</strong> ${calle}<br>
                                    <strong>Número puerta:</strong> ${numeroPuerta}<br>
                                    <strong>C.P.:</strong> ${CP}<br>
                                    <br>
                                    <strong>Pedido:</strong>
                                    <br>
                                    <strong>Código Pedido:</strong> ${dataPedido23.codigoPedido} <br>
                                    <strong>Fecha:</strong> ${dataPedido23.fecha} <br>
                                    <strong>Nombre Ecommerce:</strong> ${dataPedido23.nombreEcomm} <br>
                                    <strong>Tipo de Pago:</strong> ${dataPedido23.tipoDePago} <br>
                                    <strong>Status de Envío:</strong> ${dataPedido23.statusEnvio} <br>
                                    <strong>Productos:</strong> 
                                    ${productosHTML}
                                </p>
                        
                                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                    <strong>
                                    ¡ATENCIÓN!
                                    <br>
                                    Asegúrate de comunicarte inmediatamente y coordinar la entrega.
                                    </strong>
                                </p>
                            </div>
                        
                            <div style="background-color: #ff6f61; color: #fff; padding: 20px; text-align: center;">
                            <p style="font-size: 14px; color: #fff; ">Por favor ponte en contacto con tu proveedor a la brevedad.</p>
                            </div>
                        
                        </body>
                        </html>
                        `
                    };
                    // Envío de correos electrónicos 
                    await transporter.sendMail(mailOptionsOwner);
                    await transporter.sendMail(mailOptionsCliente);
                }
                // inicia un reclamo
                if (reclamo) {
                    mailOptionsOwner = {
                        from: "tbs-it.info@tbs-it.net",
                        to: ["sebastianpaysse@gmail.com",emailOwner],
                        subject: subjectOwner,
                        html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nueva Consulta Recibida</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">

                <div style="background-color: #ff6f61; color: #fff; padding: 20px; text-align: center;">
                    <h1 style="margin-bottom: 10px;">¡Nuevo Reclamo Recibido!</h1>
                    <img src="${logoOwner}" alt="Logo" height="50%" width="50%" style="border-radius: 100%;">
                    <p style="font-size: 16px;">Se ha recibido una nueva consulta desde tu sitio web. </p>
                    <p style="font-size: 16px;">A continuación, se detallan los datos:</p>
                </div>

                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                        <strong>Nombre:</strong> ${cliente} <br>
                        <strong>Email:</strong> ${emailCliente[0].emailCliente} <br>
                        <strong>Número de Celular:</strong> ${numCelCliente[0].numCelCliente}
                    </p>

                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;"><strong>Reclamo por el pedido número:</strong> ${codigoPedido}</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;"><strong>Mensaje:</strong> ${mensaje}</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Asegúrate de responder a esta reclamo lo antes posible.
                    </p>
                </div>

                <div style="background-color: #ff6f61; color: #fff; padding: 20px; text-align: center;">
                <p style="font-size: 14px; color: #fff; ">Por favor ponte en contacto con tu cliente a la brevedad o podrá ser objeto de suspension de tu cuenta.</p>
                </div>

            </body>
            </html>
                        `
                    };
                    mailOptionsCliente = {
                        from: "tbs-it.info@tbs-it.net",
                        to: emailCliente,
                        subject: subjectCliente,
                        html: `
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Respuesta a tu Consulta</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                        
                            <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                                <img src="${logoOwner}" alt="Logo" height="50%" width="50%" style="border-radius: 100%;">
                                <h1 style="margin-bottom: 10px;">¡Hola ${nombreCliente}!</h1>
                                <p style="font-size: 16px;">En ${nombreOwner}, hemos recibido tu consulta y queremos agradecerte por ponerte en contacto con nosotros.</p>
                            </div>
                        
                            <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                                    <strong>Mensaje: <strong>${mensaje}
                                </p>
                        
                                <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                                    Estamos trabajando en proporcionarte una respuesta y nos pondremos en contacto contigo a la brevedad posible.
                                </p>
                        
                                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                    puedes comunicarte con nosotros via whatsapp o llamando a: ${numCelOwner}.
                                    Apreciamos tu paciencia y gracias por elegirnos ${cliente}.
                                </p>
                            </div>
                        
                            <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                                <p style="font-size: 14px;color: #fff !important">Póngase en contacto con su proveedor.</p>
                            </div>
                        
                        </body>
                        </html>
                        `
                    };
                    // Envío de correos electrónicos
                    const cheqEnvio1236 = await transporter.sendMail(mailOptionsOwner);
                    const cheqEnvio25879 = await transporter.sendMail(mailOptionsCliente);
                }
                // Opciones de correo para adjuntar un archivo Excel
                if (enviarExcel) {
                    mailOptionsCliente = {
                        from: "tbs-it.info@tbs-it.net",
                        to: emailCliente,
                        subject: subjectCliente, // Asegúrate de que subjectCliente esté formateado correctamente
                        html: `
                            <!DOCTYPE html>
                            <html lang="es">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Respuesta a tu Consulta</title>
                            </head>
                            <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                            
                                <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                                    <img src="${logoOwner}" alt="Logo" height="50%" width="50%" style="border-radius: 100%;">
                                    <h1 style="margin-bottom: 10px;">¡Hola ${nombreCliente}!</h1>
                                </div>
                            
                                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                    <p style="font-size: 16px;">En ${nombreOwner}, es un gusto poder enviarte el Excel con la información solicitada.</p>

                                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                            Puedes comunicarte con nosotros vía WhatsApp o llamando al: ${numCelOwner}.
                                            Apreciamos tu preferencia y gracias por elegirnos.
                                    </p>
                                </div>
                            
                                <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                                    <p style="font-size: 14px;color: #fff !important">Por dudas póngase en contacto con nosotros.</p>
                                </div>
                            
                            </body>
                            </html>
                        `,
                        attachments: [
                            {
                                filename: otraData.filename,
                                path: otraData.filePath, // Objeto Buffer o Stream del archivo adjunto
                            }
                        ]
                    };
                    // Envío de correos electrónicos 
                    await transporter.sendMail(mailOptionsCliente);
                }
                // cancela el envio y el pedido
                if (cancelaEnvio) {
                    mailOptionsOwner = {
                        from: "tbs-it.info@tbs-it.net",
                        to: ["sebastianpaysse@gmail.com",emailOwner],
                        subject: subjectOwner,
                        html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Se cancelo el pedido número código ${codigoPedido}</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">

                <div style="background-color: #ff6f61; color: #fff; padding: 20px; text-align: center;">
                    <img src="${logoOwner}" alt="Logo" height="50%" width="50%" style="border-radius: 100%;">
                    <h1 style="margin-bottom: 10px;">¡Nueva Cancelación Recibida!</h1>
                    <h2> ¡ATENCIÓN! <br> Se cancelo el pedido número código ${codigoPedido}</h2>
                </div>

                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                        <strong>Nombre:</strong> ${cliente} <br>
                        <strong>Email:</strong> ${emailCliente.emailCliente} <br>
                        <strong>Número de Celular:</strong> ${numCelCliente}
                    </p>

                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;"><strong>Cancelación por el pedido número:</strong> ${codigoPedido}</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;"><strong>Mensaje:</strong> ${mensaje}</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        <strong>
                        ¡ATENCIÓN!
                        <br>
                        Asegúrate de responder a esta cancelación lo antes posible y arreglar las diferencias económicas que pueda haber, de resultar algún conflicto al respecto la cuenta sera suspendida.
                        </strong>
                    </p>
                </div>

                <div style="background-color: #ff6f61; color: #fff; padding: 20px; text-align: center;">
                <p style="font-size: 14px; color: #fff; ">Por favor ponte en contacto con tu cliente a la brevedad o podrá ser objeto de suspension de tu cuenta.</p>
                </div>

            </body>
            </html>
                        `
                    };
                    mailOptionsCliente = {
                        from: "tbs-it.info@tbs-it.net",
                        to: emailCliente,
                        subject: subjectCliente, // Asegúrate de que subjectCliente esté formateado correctamente
                        html: `
                            <!DOCTYPE html>
                            <html lang="es">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Se cancelo tu pedido número código ${codigoPedido}</title>
                            </head>
                            <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                            
                                <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                                    <img src="${logoOwner}" alt="Logo" height="50%" width="50%" style="border-radius: 100%;">
                                    <h1 style="margin-bottom: 10px;">¡Hola ${nombreCliente}!</h1>
                                </div>
                            
                                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                                    <p style="font-size: 16px;">En ${nombreOwner}, hemos recibido la cancelación del pedido numero ${codigoPedido}. El mismo NO te sera enviado.</p>

                                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                                            Por reintegro económico puedes comunicarte con nosotros vía WhatsApp o llamando al: ${numCelOwner}.
                                            Apreciamos tu preferencia y gracias por elegirnos.
                                    </p>
                                </div>
                            
                                <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                                    <p style="font-size: 14px;color: #fff !important">Por dudas póngase en contacto con nosotros.</p>
                                </div>
                            
                            </body>
                            </html>
                        `,
                    };
                    // Envío de correos electrónicos 
                    await transporter.sendMail(mailOptionsOwner);
                    await transporter.sendMail(mailOptionsCliente);
                }
                return true;
            } catch (error) {
                console.log("Hubo un error al enviar el correo electrónico, intente más tarde:", error);
                return error;
            }
        }

        let idCLiente = {}
        setInterval(() => {
                if (Object.keys(idCLiente).length !== 0) { // Verificar si idCliente no está vacío
                console.log('Hola');
                pushMensajeFunc(idCLiente);
            }
        }, 200000); // 5000 milisegundos = 5 segundos
        

        // Ruta para enviar una notificación push a un unico cliente
        async function pushMensajeFunc(idCliente) {
            // llaves de autenticasion
            //console.log("Que le llega a la funcion pushMensaje?", idCliente);
            idCLiente = idCliente
            const vapidKeys = {
                publicKey: "BE_rD8yHX-0G7ewPCyU65hHVUVYTe8MM3r0aXTMJfo7lMzVJidvjyqsqp1SGNyhHINsx6NjvKTx9Om3TBNg1Up8",
                privateKey: "OvPspJQ2-c3t_mv-A8ca0m0Kzqh6gBo-Id9MaE6VuZk"
            }
            try {
                // Lógica para enviar la notificación push
                // Lee el archivo JSON de configuración con las claves de VAPID
                const publicKey = vapidKeys.publicKey;
                const privateKey = vapidKeys.privateKey;
                
                // busca los clientes push en la BD
                //const pushClientes = await pushMess.find( {idCliente:idCliente} );
                const pushCliente = await pushMess.findOne({ 'dataCli.idCliente': idCliente });


                //console.log("Que le encuentra  pushCliente?", pushCliente);

                //const mailto = pushCliente.dataPushCliente.dataCli.email;
                //const vapidSubject = "http://127.0.0.1:5500/"
                //const vapidSubject = 'https://localhost:5500/';
                //const vapidSubject = 'https://2091-181-164-45-123.ngrok-free.app';
                const vapidSubject = ' https://46ca-181-164-45-123.ngrok-free.app ';
                //const mailto = 'sebastianpaysse@gmail.com';
                // Configura web-push con las claves de VAPID
                webpush.setVapidDetails(
                    vapidSubject,
                    publicKey,
                    privateKey
                );
                
                // busca 
                // Busca en la BD messages para enviarlos
                const arrayDataMensajes = await PushMensajes.find({ idCliente: idCliente });
                
                await Promise.all(arrayDataMensajes.map(async mensaje => {
                    try {
                        //const notificationPayload = JSON.stringify({ mensaje });
                        const notificationPayload = JSON.stringify({ title: '¡Nueva notificación push!', body: "message 165556456456" });
                        const subscription = pushCliente.dataPushCliente.subscription
                        const cheqSubs = await webpush.sendNotification(subscription, notificationPayload);
                        console.log('Notificación enviada correctamente al suscriptor',cheqSubs);
                    } catch (error) {
                        console.error('Error al enviar la notificación:', error);
                    }
                }));
                
                //console.log("Envia los mensajes push´s a los clientes");
                return
            } catch (error) {
                console.error('Error al enviar la notificación:', error);
                return 
            }
        }



        // guardar el mensaje el pull mensajes
        async function guardarRemito(idCliente, idOwner, EmailCliente, statusCobro){

            try {
                // Crear objeto para el mensaje del propietario
                const mensajeOwner = new Remitos({ idCliente, idOwner, EmailCliente, statusCobro });
                // Guardar el mensaje del propietario en la base de datos
                await mensajeOwner.save();
                return true
            } catch (error) {
                return false
            }
        }


module.exports = {
    guardarRemito,
    sendMail,
    guardarMensajes,
    pushMensajeFunc,
    validador1,
    val2,
    metodo1,
    cheqpass
};  