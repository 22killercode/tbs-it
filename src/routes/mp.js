require('dotenv').config();
const express   = require('express');
const router    = express.Router(); 
const fs        = require('fs');
const path      = require('path');  // Asegúrate de agregar esta línea
const axios     = require("axios")
const mongoose  = require('mongoose');
const cors      = require('cors')
const passport  = require('passport'); 
const ExcelJS = require('exceljs');
const webpush = require('web-push');
// Step 1: Import the parts of the module you want to use
// import { MercadoPagoConfig, Payment } from 'mercadopago';



const nodemailer = require('nodemailer');
// codificador
const bcrypt    = require('bcrypt');
//auntenticador
const jwt       = require('jsonwebtoken');
//pasarela de pagos
const mercadopago    = require('mercadopago');

const shortid = require('shortid');


//config MP
//mercadopago.configurations.setAccessToken('TU_ACCESS_TOKEN');

router.use(cors());



//models
const User       = require('../models/User');
const Productos  = require('../models/Ecommerce');
const Blogs      = require('../models/blogs');
const EcommUser  = require('../models/usuarioEcommerce');
const pushMensaje  = require('../models/messages');
const pushMess     = require('../models/pushMes');
const Remitos       = require('../models/remito');

const bodyParser = require('body-parser');

router.use(bodyParser.text());

const {guardarRemito,sendMail,guardarMensajes,pushMensajeFunc} = require('../routes/Midlewares');


// // // Agrega credenciales
// // let client = new MercadoPagoConfig({   accessToken: 'TEST-634616371095007-042315-22557fa3618160d8feb06b9824adcd37-540933245'});

// // let idMPUser = {}

// // const preference = new Preference(client);

// // preference.create({
// //   body: {
// //     items: [
// //       {
// //         title: 'Cocalcola',
// //         description: 'Bebida gaseosa Cocacola',
// //         quantity: 1,
// //         unit_price: 2569
// //       }
// //     ],
// //   }
// // })
// .then(data => {
//   idMPUser = data.id
//   console.log("Data:", data.id);
// })
// .catch(error => {
//   console.error("Error al crear la preferencia:", error);
// });

// solo para obtener tl oken id de MP
router.post('/create_preference3', async (req, res) => {
  const { MercadoPagoConfig, Preference } = require('mercadopago');
  // Agrega credenciales
  //console.log("Qué datos obtiene MP", req.body);

  const pedidosItems = []
  req.body.forEach(e => {
    let title = e.nombreProducto
    let description = e.descripcion
    let quantity = e.cantidad
    let unit_price = e.precio
    let subTotal = e.subTotal
    pedidosItems.push({title, description, quantity, unit_price})
  });

  try {

    let client = new MercadoPagoConfig({   accessToken: 'TEST-383820322456837-042513-b162ed609c87a4f6f7727ec84ddf7a78-1782759351'});
    
    let idMPUser = {}
    
    const preference = new Preference(client);
    
    preference.create({

      body : {
        items: pedidosItems,
        purpose: "wallet_purchase",
        //auto_return: "approved",
        //binary_mode: true,
        //statement_descriptor: "mitiendaya!",
        //external_reference : "Reference_1234",
      }
      })
    
    .then(data => {
      //console.log("Que data encontro", data);
      preference.idMPUser = data.id
      //console.log("Qué datos obtiene MPreference", preference);
      res.status(200).json(preference);
    })


  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema
    console.error('Error al crear la preferencia de pago:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

// para pagar/cobrar con tarjetas de credito debito
router.post('/process_payment', async (req, res) => {
  const { MercadoPagoConfig, Payment } = require('mercadopago');
  // Agrega credenciales
  //console.log("Qué datos obtiene MP", req.body);

  try {

    let client = new MercadoPagoConfig({   accessToken: 'TEST-383820322456837-042513-b162ed609c87a4f6f7727ec84ddf7a78-1782759351'});
    
    
    const payment = new Payment(client);
    payment.create({ body: req.body })


    .then(data => {
      console.log("Que data encontro", data);
      data.idMPUser = data.id
      //console.log("Qué datos obtiene MPreference", data);
      res.status(200).json(data);
    })

  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema
    console.error('Error al crear la preferencia de pago:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

// para cobrar o pagar con mercado pago wallet y tarjetas aprovadas
router.post('/MPwallets', async (req, res) => {
  const { MercadoPagoConfig, Preference } = require('mercadopago');
  // Agrega credenciales
  //console.log("Qué datos obtiene MP MPwallets", req.body);

  const idCliente = req.body.dataCliente._id
  const idOwner = req.body.dataCliente.idOwner
  const pedidosItems = []
  req.body.pedidoPendCobrar.forEach(e => {
    let title = e.nombreProducto
    let description = e.descripcion
    let quantity = e.cantidad
    let unit_price = e.precio
    let subTotal = e.subTotal
    pedidosItems.push({title, description, quantity, unit_price})
  });

  try {

    let client = new MercadoPagoConfig({   accessToken: 'TEST-383820322456837-042513-b162ed609c87a4f6f7727ec84ddf7a78-1782759351'});
    
    let idMPUser = {}
    
    const preference = new Preference(client);
    
    preference.create({
      body : {
        items: pedidosItems,
        back_urls: {
          success: "https://tbs-it.net/resultado/del/cobro/enMP",
          failure: "https://tbs-it.net/resultado/del/cobro/enMP",
          pending: "https://tbs-it.net/resultado/del/cobro/enMP",
        },
        payer: req.body.dataCliente.payer,
        purpose: "wallet_purchase",
        auto_return: "approved",
        binary_mode: true,
        statement_descriptor: "mitiendaya!",
        external_reference : {idCliente,idOwner}
      }
    })
    
    .then(data => {
      //console.log("Que data encontro", data);
      preference.idMPUser = data.id
      //console.log("Qué datos obtiene MPreference", preference);
      res.status(200).json(preference);
    })

  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema
    console.error('Error al crear la preferencia de pago:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});

// devolucciones de MP wallets
router.get('/resultado/del/cobro/enMP', async (req, res) => {
  try {
    //console.log("Datos recibidos en req.query:", req.query);

    // Desestructurar la información de req.query
    const { collection_id, collection_status, payment_id, status, external_reference, payment_type, merchant_order_id, preference_id, site_id, processing_mode, merchant_account_id } = req.query;
    
    //console.log("Estado de la colección:", collection_status,  external_reference);
    
    if (collection_status === "approved") {
    // Convertir external_reference a un objeto si es una cadena
      const externalReferenceObj = typeof external_reference === 'string' ? JSON.parse(external_reference) : external_reference;
      // Extraer idCliente e idOwner del objeto external_reference
      const { idCliente, idOwner } = externalReferenceObj;
      const dataCliente = await EcommUser.findById(idCliente);
      console.log("Paso los filtro y contruyo el remito:", idCliente, idOwner, dataCliente);
      const emailCliente = dataCliente.emails[0].emailCliente;
      const statusCobro = status;
      // poner cobro exitoso en la BD
    
      // poner en mensajes push el cobro exitoso para que el frontend lo tome desde allí
      await guardarRemito(idCliente, idOwner, emailCliente, statusCobro);

      console.log("Cobro exitoso");
      return res.json({ message: "Entro al cobro exitoso de MP" });
    } else {
      console.log("Cobro NO exitoso");
      return res.json({ message: "No se cobró" });
    }
  } catch (error) {
    console.error("Error al procesar el cobro en MP:", error);
    return res.status(500).json({ error: "Error al procesar el cobro en MP" });
  }
});



router.post('/buscandioRemitosMP', async (req, res) => {
  try {
    console.log("Datos recibidos en buscandioRemitosMP:", req.body);
    // Desestructurar la información recibida en req.body
    const { idCliente, idOwner } = req.body;

    // Función para buscar el estado del cobro
    const buscarEstadoCobro = async () => {
      try {
        // Buscar el remito
        const dataRemito = await Remitos.findOne({idCliente:idCliente});
        
        // Verificar si se encontró el remito
        if (dataRemito) {
          const statusCobro = dataRemito.statusCobro;
          
          // Verificar si el estado del cobro es válido
          if (statusCobro === "approved" || statusCobro === "failed") {
            // Si el estado es "approved", borrar el remito
            if (statusCobro === "approved") {
              await Remitos.findOneAndDelete(idCliente);
            }
            // Enviar la información del cliente al frontend para continuar cargando la dirección de entrega
            return res.status(200).json({ cobroExitoso: true, ok: true });
          }
        }
        
        // Esperar un segundo antes de volver a buscar
        setTimeout(buscarEstadoCobro, 1000);
      } catch (error) {
        // Manejar errores
        console.error("Error en la función buscarEstadoCobro:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    };
    
    // Iniciar la búsqueda del estado del cobro
    buscarEstadoCobro();
  } catch (error) {
    // Manejar errores
    console.error("Error en la función buscandioRemitosMP:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});




module.exports = router;
