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

const bodyParser = require('body-parser');

router.use(bodyParser.text());

const {sendMail,guardarMensajes,pushMensajeFunc} = require('../routes/Midlewares');


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



router.post('/create_preference2', async (req, res) => {
  const { MercadoPagoConfig, Preference } = require('mercadopago');
  // Agrega credenciales
  console.log("Qué datos obtiene MP", req.body);

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
        back_urls: {
          success: "https://tbs-it.net/cobroExitosoMP",
          failure: "https://tbs-it.net/cobroFallidoMP",
          pending: "http://google.com",
        },
        purpose: "wallet_purchase",
        auto_return: "approved",
        binary_mode: true,
        statement_descriptor: "mitiendaya!",
      }
      })
    
    //preference.idMPUser = "540933245-8123afb8-695a-4159-94ca-91dbca9e8e14"
    
    .then(data => {
      //console.log("Que data encontro", data);
      preference.idMPUser = data.id
      console.log("Qué datos obtiene MPreference", preference);
      res.status(200).json(preference);
    })


  } catch (error) {
    // Enviar una respuesta de error si ocurre algún problema
    console.error('Error al crear la preferencia de pago:', error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago' });
  }
});


router.get('/cobroExitosoMP', async (req, res) => {
  console.log("Datos recibidos en req.query:", req.query);
  
  // Desestructurar la información de req.query
  const { collection_id, collection_status, payment_id, status, external_reference, payment_type, merchant_order_id, preference_id, site_id, processing_mode, merchant_account_id } = req.query;
  
  if (collection_status === "aproved") {
    // poner cobro exitos  en la BD

    // poner en mensajes push el cobro exitoso asi el frontend re toma desde ahi
    

    console.log("Cobro exitoso");
    res.json({ message: "Entro al cobro exitoso de MP" });
  }
  else{
    console.log("Cobro NO exitoso");
    res.json({ message: "No se cobro" });
  }


  // Simplemente enviar un mensaje de confirmación como respuesta
});




router.get('/cobroFallidoMP', async (req, res) => {

  console.log("Datos recibidos en req.query:", req.query);
  
  // Desestructurar la información de req.query
  const { collection_id, collection_status, payment_id, status, external_reference, payment_type, merchant_order_id, preference_id, site_id, processing_mode, merchant_account_id } = req.query;
  
  if (collection_status === "aproved") {
    console.log("Cobro exitoso");
    res.json({ message: "Entro al cobro exitoso de MP" });
  }
  else{

    console.log("Cobro NO exitoso");
    // poner cobro NO exitoso  en la BD

    // poner en mensajes push el cobro NO exitoso asi el frontend re toma desde ahi
    res.json({ message: "No se cobro el pago" });
  }


});


module.exports = router;
