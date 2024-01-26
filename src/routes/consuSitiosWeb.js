require('dotenv').config();
const express   = require('express');
const router    = express.Router(); 
const nodemailer = require('nodemailer');

//appis
const shortid = require('shortid');


// Ruta de los mensajes del cliente TROPILUZ radio de Marios Pereyra
router.post('/mensajedecontactosdenuestrosclientes/claveClienteTropiluz', async (req, res) => {
    const cliente = "TROPILUZ radio"
    console.log("Llego a mensajes de clentes en TBS-IT", req.body)
    try {
        // Obtener los datos del formulario
        const { nombre, email, mensaje, numCel, ciudad, tbstk } = req.body;

        // Identificar qué cliente es (usé un ejemplo con el nombre del cliente si no existe te saca y no envia el mensaje)
        if (tbstk !== '744108/5220963.0') {
            console.log("la clave del ciente NO se encontro")
            // Responder con un código 404 si algo salió mal
            res.status(404).json({ error: 'No eres un cliente de TBS-IT' });
            return
        }
        // Buscar el email del destinatario y el email de salida (ejemplos, debes reemplazarlos con tu lógica)
        const avisoDEmail = 'mario.pereyra@tropiluz.org';
        const emailSalida = 'mario.pereyra@tropiluz.org';

        const transporter = nodemailer.createTransport({
            host: "mail.tropiluz.org",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: "mario.pereyra@tropiluz.org",
                pass: "Marioorange22",
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
            },
        });

        // Configurar el contenido del correo
        const mailOptionsCliente = {
            from: emailSalida,
            to: avisoDEmail,
            subject: 'Tienes una nueva consulta/pedido',
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
        <h1 style="margin-bottom: 10px;">¡Nueva Consulta Recibida!</h1>
        <p style="font-size: 16px;">Se ha recibido una nueva consulta desde tu sitio web. </p>
        <p style="font-size: 16px;">A continuación, se detallan los datos:</p>
    </div>

    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
            <strong>Nombre:</strong> ${nombre} <br>
            <strong>Email:</strong> ${emailSalida} <br>
            <strong>Ciudad:</strong> ${ciudad} <br>
            <strong>Número de Celular:</strong> ${numCel}
        </p>

        <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
            <strong>Mensaje:</strong> ${mensaje}
        </p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Asegúrate de responder a esta consulta lo antes posible.
        </p>
    </div>

    <div style="background-color: #ff6f61; color: #fff; padding: 20px; text-align: center;">
        <p style="font-size: 14px; color: #fff; ">Este mensaje fue enviado desde el correo electrónico de ${emailSalida}.</p>
    </div>

</body>
</html>
`
        };

        const mailOptionsConsultante = {
            from: emailSalida,
            to: email,
            subject: 'Gracias por tu consulta',
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
                    <h1 style="margin-bottom: 10px;">¡Hola ${nombre}!</h1>
                    <p style="font-size: 16px;">En ${cliente}, hemos recibido tu consulta y queremos agradecerte por ponerte en contacto con nosotros desde la ciduad de ${ciudad}.</p>
                </div>
            
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                        ${mensaje}
                    </p>
            
                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                        Estamos trabajando en proporcionarte una respuesta y nos pondremos en contacto contigo a la brevedad posible.
                    </p>
            
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Apreciamos tu paciencia y gracias por elegirnos ${cliente}.
                    </p>
                </div>
            
                <div style="background-color: #007bff; color: #fff; padding: 20px; text-align: center;">
                    <p style="font-size: 14px;color: #fff !important">Este mensaje fue enviado desde el correo electrónico de ${emailSalida}.</p>
                </div>
            
            </body>
            </html>
            `
        };

        // Enviar email al cliente sobre la consulta
        await transporter.sendMail(mailOptionsCliente);

        // Enviar email al consultante que a la brevedad le será respondido
        await transporter.sendMail(mailOptionsConsultante);


        //res.status(200).json({ mensaje: 'Correo enviado exitosamente' });
        console.log("https://22killercode.github.io/tropiluz/#mensajeEnvio",)
        res.redirect("http://tropiluz.org/#mensajeEnvio");
    } catch (error) {
        // Responder con un código 404 si algo salió mal
        res.status(404).json({ error: 'Error al enviar el correo', error });
    }
});


module.exports = router