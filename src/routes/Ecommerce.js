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


// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
    const token = req.headers.authorization || req.query.token || req.body.jwtToken || req.body.jwtToken2 || req.body.jwtToken3 || null;
    //console.log("Entro a verificar token", token )
    if (!token) {
        console.log("token no proporcionado", token)
        req.flash("error", "Clave de seguridad no proporcionado desde el frontend");
        // aqui hay que avisar si se cargo bien o no el usuario y salir a la pagina principal
        //return res.redirect("/")
        return res.status(401).json({ mensaje: 'Token no proporcionado desde el frontend' });
    }
    jwt.verify(token, 'Sebatoken22', (err, decoded) => {
        console.log("Verificando el token")
        if (err) {
            console.log("token invalido", err)
            //return res.status(403).json({ mensaje: 'Token inválido' });
            req.flash("error", "Clave de seguridad no proporcionado desde el frontend");
            // aqui hay que avisar si se cargo bien o no el usuario y salir a la pagina principal
            return res.redirect("/")
        } 
      // El token es válido, puedes acceder a la información del usuario en decoded
        req.usuario = decoded; 
        console.log("token verificado", token)
        next();
    });
};


// para armar NUEVOS productos/servicios con AXIOS desde el panle de control de TBS // REVISAR FILTRO DE CANTIDAD DE PRODUCTOS 
router.post('/enviarArchivos/ecommerce',   async (req, res) => {
    console.log("000 /enviarArchivos/ecommerce", req.body);
    console.log("000 /enviarArchivos/ecommerce   req.files",req.files );
    // revisar que llega toda la info dle frontend
    const {rubro, nombreProducto, descripcion, cantidad, precio, id, moneda, categoria} = req.body
    const archivos  = req.files.archivos
    const idCliente = id

    try {
        // busca la informacion del cliente que quiere emitir un nuevo blog
        const usuario = await User.findById(id);
        const empresa = usuario ? usuario.empresa : null;
        // revisa si ya tiene los 10 blogs maximos permitidos
        console.log("Cuantos pproductos tiene cargados.");
        // termnar de filtrar por categoria de clientes y productos que puede subir al ecommece
        if (!id) {
            const idUser = idCliente
            console.log("Tienes mas de 100 productos cargados elimina algunos por favor.");
            req.flash("error","Tienes mas de 10 blogs cargados elimina algunos por favor.")
            res.redirect(`/volviendoleruleru?id=${idUser}`)
            return
        }
        console.log("0 que empresa encontro", empresa, id);
        // Enviar solicitud a Dovemailer Cloud Archivos usando AXIOS
            async function enviararchivosAServidorB(archivos, ob1, ob2) {
            try {
                // 1. Leer la archivos en formato base64
                const datosAEnviar = []
                for (const a1 of archivos) {
                    const data = fs.readFileSync(a1.tempFilePath, { encoding: 'base64' });
                    // 2. Construir el objeto de datos a enviar
                    const datAEnviar = {
                        dataIMGArchivo: {
                            name: a1.name,
                            data: data,
                            size: a1.size,
                            encoding: a1.encoding,
                            mimetype: a1.mimetype,
                            md5: a1.md5
                        },
                    };
                    datosAEnviar.push(datAEnviar)
                }
                // igualamos todo
                const datAEnviar = {}
                datAEnviar.ob1 = ob1
                datAEnviar.ob2 = ob2
                datAEnviar.datosAEnviar = datosAEnviar

                console.log("que ahy en datos a enviar a Dovemailer", datAEnviar)
                
                // 3. Enviar la archivos y los objetos al servidor B
                //const urlServidorB = 'https://dovemailer.net/crearCarpetayGurdarProductos'; // Reemplaza con la URL correcta de tu servidor B
                const urlServidorB = 'http://localhost:3009/crearCarpetayGurdarProductos'; // Reemplaza con la URL correcta de tu servidor B
                const respuesta = await axios.post(urlServidorB, datAEnviar, {
                    withCredentials: true, // Importante para incluir las cookies o credenciales
                });

                // 4. Manejar la respuesta del servidor B
                console.log('Respuesta del servidor B:', respuesta);
                return respuesta.data
                } catch (error) {
                    console.error('Error al procesar la solicitud:', error.message);
                }
            }
            
            // Llamada a la función para enviar las archivoses al server de Dovemailer con los datos necesarios

            const cheq = await enviararchivosAServidorB(archivos, empresa, id);        
            console.log("QUE CARAJOS TIENE CHEQ", cheq)

            // guardar info en la BD
            if (cheq.mensaje === 'Datos guardados correctamente') {
                console.log("Entro a carga el blog a la BD")
                try {
                    //const rutaBase     = `https://dovemailer.net/`;
                    const rutaBase      = `http://localhost:3009/`
                    const rutaSimpleImg = []
                    const pathImgs      = []
                    for (const a1 of cheq.datos) {
                        const rutaSimple2 = a1.rutaSimple2
                        const pathImg = a1.rutaCompletaArchivo
                        const rutaURL = (` ${rutaBase}img/${rutaSimple2}`);
                        if (rutaSimple2 &&  pathImg) {
                            rutaSimpleImg.push(rutaURL)
                            pathImgs.push(pathImg)
                        }
                    }
                    console.log("Que ruta URL fabrico",{rubro, nombreProducto, descripcion, cantidad, precio, pathImgs, rutaSimpleImg, idCliente, empresa, moneda, categoria});
                    const newProd = new Productos({rubro, nombreProducto, descripcion, cantidad, precio, pathImgs, rutaSimpleImg, idCliente, empresa, moneda, categoria});
                    await newProd.save();
                    console.log(" el  blog se cargo exitosamente")
                    //return res.status(200).json({ message: "El  Blog se cargo exitosamente" });
                    req.flash("success_msg","El producto/servicio se cargo correctamente.")
                    const idUser = idCliente
                    res.redirect(`/volviendoleruleruProd?id=${idUser}`)
                    } catch (error) {
                    console.log(" El  producto NO se guardo en la BD",error )
                }
            }else{
                console.error("El producto NO se guardo en el server Dovemailer ni la BD");
                req.flash("error","El producto NO se cargo correctamente, intente mas tarde")
                const idUser = idCliente
                res.redirect(`/volviendoleruleruProd?id=${idUser}`)
            }
    } catch (error) {
        console.error("Error al procesar la solicitud a final de todo:", error);
        req.flash("error","El producto NO se cargo correctamente, intente mas tarde")
        const idUser = idCliente
        res.redirect(`/volviendoleruleruProd?id=${idUser}`)
    }
});


// Enviar solicitud a Dovemailer para retirar las imagenes Cloud Archivos usando AXIOS
router.post('/eliminarProdServ',  async (req, res) => {
    console.log("Desde /eliminarProdServ server TBS ingreso a borrar el producto",req.body)
    const id = req.body.id
    try {
        console.log("Desde /eliminarProdServ server id",id)
        const dataE = await Productos.findById(id);
        dataE.date = "null"
        console.log("TBS ingreso cual Poductos econtro",dataE)
        const idCliente = dataE.idCliente
        const dataUser = await User.findById(idCliente)
        console.log("TBS  /eliminarProdServ  ingreso cual dataUSer econtro",dataUser)
        // hace una llamada al server Dovemailer para elminar la imagen
        async function enviarImagenAServidorB(dataE) {
            console.log("Entro a la fucion de AXIOS para enviar al server de Dovemailer, enviarImagenAServidorB");
            try {
                // 3. Enviar la imagen y los objetos al servidor B
                //const urlServidorB = 'https://dovemailer.net/TBSeliminarImagenProd'; // Reemplaza con la URL correcta de tu servidoB
                const urlServidorB = 'http://localhost:3009/TBSeliminarImagenProd'; // Reemplaza con la URL correcta de tu 
                const respuesta = await axios.post(urlServidorB, dataE, {
                    withCredentials: true, // Importante para incluir las cookies o credenciales
                });
                // 4. Manejar la respuesta del servidor B
                console.log('Respuesta del servidor B:', respuesta.data);
                return respuesta.data
            } catch (error) {
                console.error('Axios entro en error al procesar la solicitud:', error.message);
                return false
            }
        }
        const response = await enviarImagenAServidorB(dataE) 
        if (response) {
            // Eliminar el blog por su ID
            await Productos.findByIdAndDelete(id);
            // enviar estatus OK
            const idUser = idCliente
            req.flash("success_msg","El producto/servicio se elimino correctamente.")
            res.redirect(`/volviendoleruleruProd?id=${idUser}`);
            console.log("El blog ha sido borrado");
            return
        } else {
            return res.status(400).send("Error: El server de Dovemailer no respondio la eliminacion"); // o algún otro mensaje de error
        }
    } catch (error) {
        const idUser = idCliente
        console.log("Ocurrió un error al borrar el blog", error);
        req.flash("error","Hubo un error al borrar el blog., intentelo de nuevo mas tarde.")
        res.redirect(`/volviendoleruleruProd?id=${idUser}`)
        // res.status(500).json({ success: false, message: "Hubo un error al borrar el blog." });
    }
});


// solicita todos los productos y servicios
router.post('/buscandoPostdeEcommerce', async (req, res) => {
    try {
        // accesos de seguridad
        const formData = req.body;
        // console.log("llega la petición /buscandoPostdeBlogs", formData);
        
        // if (formData === '147852369') {
            //     console.log("NO paso el filtro de seguridad");
            //     return res.status(400).json({ success: false, message: 'No tienes el ID de seguridad' });
            // }
            // busca al dueño dell ecomerce
            const dataDueno     = await User.findOne({ email: "sebastianpaysse@gmail.com" })
            // busca los datos de la BD de los productos
            const dataProductos = await Productos.find({ emailCliente: "sebastianpaysse@gmail.com" }).sort({ date: -1 });
            //console.log("que enciuentra desd el apgina web /dataDueno",dataDueno)
            dataProductos.nombreEcommerce = dataDueno.nombreEcommerce

        //console.log('Desde TBSIT dataSend recibidas:', dataBlogs);

        res.status(200).json({ success: true, data: dataProductos });

    } catch (error) {
        console.error('Error handling the request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// revisa las direcciones del userEcomm
router.post('/averiguar/si/tiene/direecionesvalidadas', async (req, res) => {
const clientIP = req.ip || req.connection.remoteAddress;
    console.log("llega algo del Ecommerce para revisar las direcciones de envio de los productos", clientIP, req.body)
    let dataFront = req.body
try{
        // ver que procutos llegan y sus cantidades
        const userEcomm = await EcommUser.findById(dataFront.clienteEcomm.idCliente);
        // revisa las direcciones que tiene guardadas y las re envia
        const direcciones = userEcomm.direcciones;
        console.log("QUE DIRECCIONES GUARDADAS ENCONTRO?", direcciones);
        if (direcciones.length !== 0) {
            console.log("SI ENCONTRÓ DIRECCIONES GUARDADAS");
            const dataDir = JSON.stringify(direcciones);
            res.status(200).json({ success: true, data: dataDir });
        } else {
            console.log("NO ENCONTRÓ DIRECCIONES GUARDADAS");
            res.status(200).json({ success: false, data: "No tiene direcciones guardadas" });
        }
        
    } catch (error) {
        console.error('Error no se obtuvieron los datos de la BD de mongo', error);
        res.status(500).json({ error: 'Error no se obtuvieorn los datos de la BD de mongo' });
    }

});


//obteniendo los datos dle cliente y sus pedidos de forma AUTOMATICA cuando se abre el modal usuario
router.post('/obteniendo/los/datos/del/cliente', async (req, res) => {
    const dataFronCli  = JSON.parse(req.body);

    //console.log("********que datos llegan del frontend", dataFronCli);

    const { jwtToken, cliente } = dataFronCli;

    // Desestructurar la información del cliente
    const { email, nombre, numCel, ipCliente, duenoEcom, idCliente } = cliente;
    
    // Luego puedes usar estas variables según sea necesario en tu código
    
    try {
        // Realizar la búsqueda en la base de datos
        const dataCliente = await EcommUser.findById(idCliente);
        //console.log("********que datos llegan del usuarioEncontrado", dataCliente);

        const imgCli = dataCliente.imgCli ?? "http://localhost:3019/images/usuario.png";
        dataCliente.imgCli = imgCli
        
       // console.log("Que datos encontro del cliente en la BD??", dataCliente.email);

        // Devolver el status adecuado al frontend con la leyenda de Pedido Aprobado
        res.status(200).json({ success: true, data: dataCliente})
    } catch (error) {
        console.error("EL backend NO encontro nada en la BD", error);
        // Devolver el status adecuado al frontend con la leyenda de Pedido Aprobado
        res.status(400).json({ success: false, message: `EL backend NO encontro nada en la BD`})
    }

});


// cofirmar la compra desdpues de haber pasado por MP pasa directo si es contra entrega
router.post('/confirmarCompra165165156', async (req, res) => {
    console.log("***************////////////////*****************llega algo del Ecommerce /confirmar-compra", req.body);
    const codigoPedido = shortid.generate()
    let tiPago = null
    try {
        // Acceder a cada objeto dataPedidoConf desde req.body
        const dataPedidoConf = req.body.dataPedidoConf;
        const { pedido, cliente, dataDir, idOwner } = dataPedidoConf;
        const dataCli = cliente;
        const pedidos = JSON.parse(pedido);
        console.log("*77777777777777777777777777777777777**********************Que se obtiene de pedido, cliente, dataDir;",dataCli, pedidos);
        const fecha = new Date();
        // Comprobar cliente y datos
        const dataCliente    = await EcommUser.findById(dataCli._id);
        const dataDueno      = await User.findById(idOwner);
        //console.log("0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000que cliente encotnro", dataCliente)
        //console.log("que dataDueno encotnro", dataDueno)
        const idDueno        = dataDueno._id;
        const idCliente      = dataCliente._id;
        const statusEnvio    = "Armando su pedido";
        const logoOwner      = dataDueno.logoOwner
        const nombreEcomm    = dataDueno.nombreEcommerce
        // Inicializar arrays si no están definidos
        if (!dataCliente.comprasCliente) {
            dataCliente.comprasCliente = [];
        }
        if (!dataDueno.Ventas) {
            dataDueno.Ventas = [];
        }

        const listaProductos = [] 
        // Iniciar un array para almacenar las promesas de actualización de productos
        const updatePromises = pedidos.map(async (e) => {
            const idProducto = e.idProducto;
            const cantidadProductos = e.cantidad;
            const imgProd = e.imagen;
            const precio = e.subTotal;
            const nombreProd = e.nombreProducto;
            const subTotalCompra = precio * cantidadProductos;
            
            // Crea un objeto con las claves y valores correspondientes
            const producto = {
                imgProd: imgProd,
                nombreProd: nombreProd,
                precio: precio,
                cantidadProductos: cantidadProductos,
                idProducto: idProducto,
                subTotalCompra: subTotalCompra
            };
            
            listaProductos.push(producto); // Agrega el objeto al array listaProductos
            
            // obtiene el tipo de pago
            const tipoDePago = e.tipoDePago;
            tiPago = tipoDePago;
        
            // Restar las cantidades de productos vendidas en el stock y envia un email cuando queda uno solo
            const dataProductos = await Productos.findById(idProducto);
            if (!dataProductos) {
                throw new Error(`No se encontró el producto con ID ${idProducto}`);
            }
            dataProductos.cantidad -= cantidadProductos;
            // Enviar emails cuando queda 1 solo producto
            if (dataProductos.cantidad <= 1) {
                console.log("Envía un email avisando que solo queda una unidad de este producto");
                // Aquí va la lógica para enviar el email

                // guarda el mensaje para los push mensaje
                const dataOwner = dataDueno
                mensaje.messageOwner = `Te queda un solo producto en tu stock de: ${producto.nombreProd}`;
                const subjectOwner = mensaje
                const idOwner = dataOwner._id
                guardarMensajes(dataOwner, dataCliente, mensaje, subjectOwner, idOwner,codigoPedido)

            }
            await dataProductos.save(); // Guardar los cambios en la base de datos de los productos
        });
        
        const dataCompra = {
            codigoPedido,
            fecha,
            logoOwner,
            nombreEcomm,
            idCliente,
            idDueno,
            tipoDePago : tiPago,
            statusEnvio,
            listaProductos,
        };
        

        // Calculando el total de la compra
        let totalCompra = 0;
        let totalCantProd = 0;
        listaProductos.forEach(producto => {
            totalCompra += producto.subTotalCompra;
            totalCantProd += producto.cantidadProductos;
        });
        dataCompra.TotalCompra = totalCompra;
        dataCompra.totalProductos = totalCantProd;
        
        dataCliente.comprasCliente.push(dataCompra);


        // Agregar la cantidad de productos vendidos al dueño del Ecommerce
        // Extraer los datos de la dirección de dataDir excluyendo el array pedido
        if (req.body) {
            console.log("PAso el req.body")
            const { pedidos, ...direccionSinPedido } = dataDir;
            // Crear el objeto datosVenta con los datos de la compra y los datos de la dirección
            const datosVenta = {
                dataCompra: dataCompra,
                dataDir: direccionSinPedido
            };
            dataDueno.Ventas.push(datosVenta);

            // Verificar si el idCliente ya está presente en dataDueno.clientes
            if (!dataDueno.clientes.includes(idCliente)) {
                // Si no existe, agregarlo al array
                dataDueno.clientes.push(idCliente);
            }
            tiPago = dataCompra.tipoDePago

            // Agregar la dirección si es nueva o no tenía
            const dires = dataCliente.direcciones;
            if (dires.length <= 4) {
                //console.log("Tiene menos de 4 direcciones guardadas.", dires.length);
                const cheqCalle  = dires.find(d => d.calle === dataDir.calle );
                const cheqPuerta = dires.find(d => d.numeroPuerta === dataDir.numeroPuerta);
                if (!cheqCalle, !cheqPuerta) {
                    dataCliente.direcciones.push(dataDir);
                    //console.log("No tenía la dirección guardada, así que se guardó.");
                }
            }

            // Esperar a que todas las promesas de actualización se resuelvan
            await Promise.all(updatePromises);
            //console.log("que datos dle cliente se obtuvo.", dataCliente);

            // Guardar los cambios en la base de datos del cliente y del dueño
            await dataDueno.save();
            await dataCliente.save();
            const message = `
                <div class="text-white">
                    <p>Su pedido ${tiPago} ha sido aprobado 
                        <br><br>
                        <iframe style="border-radius:1rem" src="https://giphy.com/embed/f3orDrv1hzyMvgI3y6" width="130" height="130" frameborder="0" class="giphy-embed" allowfullscreen></iframe>
                        <br><br>
                        <strong>Código de pedido: ${codigoPedido}</strong>
                    </p>
                    <div class="text-body" style="text-align: justify; color:white !important">
                        <h5>
                            Le estamos enviando un email con los datos a usted y su proveedor para que coordinen el modo de pago contra entrega y los costos de envío si los hubiera, así como también la fecha y hora de entrega.
                        </h5>
                    </div>
                </div>
                <a style="margin-top:-0.51rem" class="btn btn-primary" href="/"><p>Terminar</p></a>
                `;

            // Devolver el status adecuado al frontend con la leyenda de Pedido Aprobado
            const data = {message, dataCliente}
            console.log("Esta es la data que se envia al fronen una vz guardada la compra *************************************", data)
            res.status(200).json({ success: true, data });



        // enviar por email al cliente y owner el pedido y tambien a serviceWorker para que haga un pushnotification
        // envia los emails avisando la cancelacion del pedido
        const dataOwner = dataDueno
        const { reclamo, enviarExcel, cancelaEnvio} = false
        const transportEmail = dataOwner.transportEmail
        const emailCliente = dataCliente.emails[0]
        const numCelCliente = dataCliente.numCel[0].numCelCliente
        const numCelOwner = dataOwner.numCel[0]
        const messageOwner = `Teines un nuevo pedido con número de codigo ${codigoPedido}, comunicate para coordinar el dia y horario de entrega.`
        const messageCliente = `El pedido número de codigo ${codigoPedido} fue recibido con éxito y se esta armando, comunicate para coordinar el dia y horario de entrega.`
        const nombreOwner = dataOwner.nombreEcommerce
        const nombreCliente = dataCliente.nombre
        const subjectCliente = `Hola ${nombreCliente} tu pedido número de codigo ${codigoPedido} fue recibido con éxito`
        const subjectOwner = `Felicitaciones ${nombreOwner} tienes un nuevo pedido con el número de codigo ${codigoPedido}`
        const logoOwner = dataOwner.logoOwner
        const emailOwner = dataOwner.email
        const pedidoCobrado = true
        let otraData = {}
        otraData.dataDir = datosVenta.dataDir
        otraData.dataPedido23 = datosVenta.dataCompra
        const mensaje = {messageOwner,messageCliente}
        const dataEnviarEmail =  {transportEmail, reclamo, enviarExcel, emailOwner, emailCliente, numCelCliente, numCelOwner, mensaje, codigoPedido, nombreOwner, nombreCliente, subjectCliente, subjectOwner, otraData,logoOwner, cancelaEnvio, pedidoCobrado};
        const enviarEmails = await sendMail(dataEnviarEmail) 

        // guarda el mensaje para los push mensaje
        guardarMensajes(dataOwner, dataCliente, mensaje, subjectOwner, subjectCliente, codigoPedido)

        }
    } catch (error) {
        console.error("Error en el proceso /confirmarCompra165165156", error);
        // Enviar una respuesta de error al cliente
        res.status(500).json({ success: false, message: "Ocurrió un error al procesar la compra, intente de nuevo mas tarde" });
    }    
  
});    



// revisa si ahy internet
router.get('/hayInternet', async (req, res) => {

    res.status(200).json({ success: true });
});


// pasa a confirmar cobro
router.post('/Status200cobrarOkMP', async (req, res) => {
    console.log("llega algo del Ecommerce para cobrar los productos", req.body)

    // si se cobra OK
    //procesar los datos de:
    // cantidad de productos comprados en la BD del cliente
    // cantidad de productos vendidos den la BD del duemño del ecommerce
    //si todo esto salio OK enviar status 200 y nuevo token

    res.status(200).json({ success: true, data: "producto" });
    // si no se cobra
    //res.status(400).json({ success: false, data: producto });


    // si algo sale mal enviar 400 o 500
    //res.status(400).json({ success: false, data: producto });

})

// revisa de forma automatica los datos del Owner el ecommerce
router.post('/chekandoDatosOwnerEcomm', async (req, res) => {

   // console.log("llega algo de FORMA AUTOMATICA Ecommerce para enconrar AUTOMATICAMENTE a slo cleintes", req.body)

    const {idOwner} = req.body

    //revisar con los datos que me tira si este ip o los datos del local storage me hayan un cliente
    try {
            const ownerEcomm  = await User.findOne({ idOwner: idOwner });
            if (ownerEcomm) {
            // Generar el token JWT con la información del usuario (en este caso, solo el email)
            const data = ownerEcomm
            res.status(200).json({ success: true, data: data });
            } else {
            res.status(500).json({ success: false, data: "No es cliente" });
            }
    } catch (error) {
        console.error("Error en la busqueda del ecommerce", error)
    }

})


// revisa si es clinte y llega el IP de forma automatica cuando se abre a pagina
router.post('/chekandoSiEsCliente', async (req, res) => {

    const ipCliente = req.ip || req.connection.remoteAddress;
    //console.log("llega algo de FORMA AUTOMATICA Ecommerce para enconrar AUTOMATICAMENTE a slo cleintes", req.body, ipCliente)
    const {  idCliente, nombre, email, token, ip, idOwner} = req.body
try {
    //revisar con los datos que me tira si este ip o los datos del local storage me hayan un cliente
        // Buscar al cliente por email
        //const cienteEcomm = await EcommUser.findOne({ email: { $elemMatch: { emailCliente: primerEmail } } });
        const cienteEcomm = await EcommUser.findById(idCliente);
        const ownerEcomm  = await User.findOne({ idOwner: idOwner });
        
        //cienteEcomm.idCliente = cienteEcomm._id
    
    if (cienteEcomm) {
            // Generar el token JWT con la información del usuario (en este caso, solo el email)
            const token = jwt.sign({ email: email }, 'Sebatoken22', { expiresIn: '15m' });
            const data = {token, cienteEcomm, ownerEcomm}
            res.status(200).json({ success: true, data: data });
        } else {
            res.status(500).json({ success: false, data: "No es cliente" });
        }
    
} catch (error) {
    console.error("Error en la busqueda de datos dle cleinte", error)
}


});


// SIGNIN desde el signIn MANUAL busca el usuario cliente del ecommerce de forma MANUAL
router.post('/buscarUsurarioEcommerce', async (req, res) => {
    const ipCliente = req.ip || req.connection.remoteAddress;
    //console.log("Llega algo desde buscarUsurarioEcommerce de forma MANUAL del Ecommerce para inscribir clientes", req.body, ipCliente);

    try {
        const { email, password, ip } = req.body;
        // Buscar al cliente por email
        const clienteEcomm = await EcommUser.findOne({ emailOficial: email});
       // console.log("Que cliente Ecomm encuentra",clienteEcomm);
        if (clienteEcomm) {
            // Aquí puedes verificar la contraseña de manera segura utilizando técnicas de hash y sal
            // En este ejemplo, simplemente comparamos las contraseñas en texto plano (lo cual NO es seguro en un entorno de producción)
            if ( password) {

                // Supongamos que tienes el hash de la contraseña almacenado en la base de datos
                const hashedPasswordFromDatabase = clienteEcomm.password; // Obtén el hash de la contraseña del usuario desde la base de datos
                
                // Supongamos que el usuario proporciona su contraseña durante el inicio de sesión
                const userProvidedPassword = password; // La contraseña que el usuario proporciona durante el inicio de sesión
                
                // Compara el hash de la contraseña almacenada en la base de datos con la contraseña proporcionada por el usuario
                bcrypt.compare(userProvidedPassword, hashedPasswordFromDatabase, function(err, result) {
                    console.error('Entro a BCRYPT',);
                    if (err) {
                        console.error('Error al comparar contraseñas:', err);
                        // Manejar el error adecuadamente
                    } else {
                        if (result) {
                            // La contraseña es correcta, procede con el inicio de sesión
                            console.log('Contraseña correcta. Inicio de sesión exitoso.');
                            // Generar el token JWT con la información del usuario
                            const token = jwt.sign({ email: clienteEcomm.emailOficial }, 'Sebatoken22', { expiresIn: '15m' });
                            const data = { token, clienteEcomm };
                            res.status(200).json({ success: true, data });
                            console.log("Encontró un cliente Ecommerce y se envio la data al Frontend", data);
                            return
                        } else {
                            // La contraseña es incorrecta, muestra un mensaje de error al usuario
                            console.log('Contraseña incorrecta. No se pudo iniciar sesión.');
                            res.status(401).json({ success: false, message: "Contraseña incorrecta" });
                            console.log("Contraseña incorrecta");
                            return            
                        }
                    }
                });

            } else {
                res.status(401).json({ success: false, message: "Contraseña incorrecta" });
                console.log("Contraseña incorrecta");
            }
        } else {
            res.status(404).json({ success: false, message: "No se encontró ningún cliente revise su Email-Usuario" });
            console.log("No se encontró ningún cliente Ecommerce");
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ success: false, message: "El servidor No encontro el usuario revise su email y password" });
    }
});


//SinUP de clientes en forma manual
router.post('/inscribirClienteEcomerce', async (req, res) => {
    const ipCliente = req.ip || req.connection.remoteAddress;
    console.log("llega algo del Ecommerce para inscribir clientes", req.body, ipCliente)

    const { nombre, apellido, email, numCel, password, urlOwner } = req.body;

    // Verificar la presencia de todos los campos requeridos
    if (!nombre || !apellido || !email || !numCel || !password) {
        // Al menos uno de los campos requeridos está ausente
        const camposFaltantes = [];
        
        if (!nombre) camposFaltantes.push('nombre');
        if (!apellido) camposFaltantes.push('apellido');
        if (!email) camposFaltantes.push('email');
        if (!numCel) camposFaltantes.push('numCel');
        if (!password) camposFaltantes.push('password');
    
        const mensajeError = `Faltan los siguientes campos: ${camposFaltantes.join(', ')}`;
        
        return res.status(400).json({ error: true, mensaje: mensajeError });
    }
    
    // Si todos los campos requeridos están presentes, continuar con el procesamiento
    // ...

    try {
        const dataUSerEcomm = new EcommUser({ 
            nombre, 
            apellido,
            emailOficial : email,
            emails: [{ emailCliente: email }], // Agregar el email al array email
            numCel: [{ numCelCliente: numCel }], // Agregar cada número de celular al array numCel
            password, 
            realPass : password,
            duenoEcom : [{urlOwner:urlOwner}],
            desingOwner : "none",
            ipCliente,
            imgCli : "http://localhost:3019/images/usuario.png",
            direcciones : [],
            comprasCliente : [],
        });
        
        dataUSerEcomm.idCliente = dataUSerEcomm._id;
        dataUSerEcomm.password = await dataUSerEcomm.encryptPassword(password);

        // Guardar el usuario en la base de datos
        await dataUSerEcomm.save();
            
        // Generar el token JWT con la información del usuario (en este caso, solo el email)
        const token = jwt.sign({ email: email }, 'Sebatoken22', { expiresIn: '15m' });
    
        res.status(200).json({ success: true, data: token });
        return;
        
    } catch (error) {
        return res.status(400).json({ error: true, mensaje: error });
    }

});


// se actualizan los datos del ususario del ecommerce
router.post('/upDate/datos/Cliente', async (req, res) => {

    console.log("llega algo del Ecommerce para inscribir clientes", req.body)
    if (req.body.cambiarImg) {
        const id = req.body.idCliente
        console.log("Entro a cambiar imagen")
            const empresa = "imgClientes"
            // Enviar solicitud a Dovemailer Cloud Archivos usando AXIOS
            async function enviarImagenAServidorDovemailer(imagen, ob1, ob2) {
                try {
                    // 1. Leer la imagen en formato base64
                    const data = fs.readFileSync(imagen.tempFilePath, { encoding: 'base64' });
                    // 2. Construir el objeto de datos a enviar
                    const datosAEnviar = {
                        imagen: {
                            name: imagen.name,
                            data: data,
                            size: imagen.size,
                            encoding: imagen.encoding,
                            mimetype: imagen.mimetype,
                            md5: imagen.md5
                        },
                        ob1: ob1,
                        ob2: ob2
                    };
                    
                    // 3. Enviar la imagen y los objetos al servidor 
                    //const urlServidorB = 'https://dovemailer.net/updatedImgUsarioyOwner'; // Reemplaza con la URL correcta de tu servidor B
                    const urlServidorB = 'http://localhost:3009/updatedImgUsarioyOwner'; // Reemplaza con la URL correcta de tu servidor B
                    const respuesta = await axios.post(urlServidorB, datosAEnviar, {
                        withCredentials: true, // Importante para incluir las cookies o credenciales
                    });

                    // 4. Manejar la respuesta del servidor 
                    console.log('Respuesta del servidor Dovemailer :', respuesta.data);
                    return respuesta.data
                    } 
                catch (error) {
                    console.error('Error al procesar la solicitud:', error.message);
                    }
            }
            
        try {
            // Llamada a la función para enviar las imagenes al server de Dovemailer con los datos necesarios
            const cheq = await enviarImagenAServidorDovemailer(req.files.imagen, empresa, id);        
            console.log("QUE CARAJOS TIENE CHEQ", cheq)
            if (cheq) {
                //guarda la ruta de la imagen en la BD de la cuenta de usuario y envia un status 200
                const {rutaURL } = cheq.datos
                //const rutaBase     = `https://dovemailer.net/`;
                const rutaBase       = `http://localhost:3009/`
                const rutaRelativa   = (` ${rutaBase}img/${rutaURL}`);
                const imgCli         = rutaRelativa;
                await EcommUser.findByIdAndUpdate(id,{imgCli})
                res.status(200).json({ success: true, data: "Imagen guadada perfetamente" });
            } else {
                    //guarda la imagen en la BD de la cuenta de usuario y envia un status 200
                    res.status(500).json({ success: false, data: "Imagen NO guadada perfetamente" });
                    console.error("Imagen NO guadada perfetamente",);
            }
        } catch (error) {
            console.error("que error encontro en la carga de la imagen del usuario ",error);
        }

    }

    if (req.body.updateCel) {
        console.log("Entro a upDated Celu");
    
        const { confirmCel, numerosCelulares, idCliente } = req.body;
        try {
            const dataCliente = await EcommUser.findById(idCliente);
    
            let responseData = {};

            // Aquí agregamos uno mas y actualizamos en la BD en el array numCel el numCelu=confirmCel por el numerosCelulares
            if (confirmCel && numerosCelulares) {
                const updatedDataCliente = await EcommUser.findByIdAndUpdate(idCliente, { $set: { 'numCel.$[elem].numCelCliente': confirmCel } }, { arrayFilters: [{ 'elem.numCelCliente': numerosCelulares }], new: true });
                responseData.message = `Se actualizó el número celular ${numerosCelulares} por ${confirmCel}`;
            }

            // aqui e elimina el que selecciono
            if (numerosCelulares && confirmCel === '') {
                const numCelu = dataCliente.numCel.length;
                if (numCelu <= 1) {
                    responseData.message = `Debes tener al menos un número celular`;
                    res.status(400).json({ success: false, data:responseData});
                    return
                }
                // Aquí eliminamos en la BD en el array numCel el numCelu=confirmCel
                const updatedDataCliente = await EcommUser.findByIdAndUpdate(idCliente, { $pull: { numCel: { numCelCliente: numerosCelulares } } }, { new: true });
                responseData.message = `Se eliminó el número celular ${confirmCel}`;
            }
            
    
            // Aquí agregamos en la BD en el array numCel el numCelu=numerosCelulares
            if (confirmCel && numerosCelulares === '') {
                const updatedDataCliente = await EcommUser.findByIdAndUpdate(idCliente, { $addToSet: { numCel: { numCelCliente: confirmCel } } }, { new: true });
                responseData.message = `Se agregó el número celular ${numerosCelulares}`;
            }
            
    
            console.log('Datos actualizados correctamente:', responseData);
            res.status(200).json({ success: true, data: responseData });
        } catch (error) {
            console.error('Error al actualizar los datos del cliente:', error);
            res.status(500).json({ success: false, data: responseData});
            // Manejo de errores
        }
    }

    if (req.body.updateEmail) {
        console.log("Entro al CRUD de los Email´s");
        const { confirmEmail, AllEmails, idCliente } = req.body;
        try {
            const dataCliente = await EcommUser.findById(idCliente);
            let responseData = {};
    

            if (confirmEmail && AllEmails !== 'Elije emodificar/Elimina un Email') {
                console.log("Entro Modificar un Email");
                const updatedDataCliente = await EcommUser.findByIdAndUpdate(idCliente, { $set: { 'emails.$[elem].emailCliente': confirmEmail } }, { arrayFilters: [{ 'elem.emailCliente': AllEmails }], new: true });
                responseData.message = `Se actualizó el email ${AllEmails} por ${confirmEmail}`;
            }

            // elimina un email
            if (AllEmails && confirmEmail === '') {
                console.log("Entro a eliminar un Email");
                const cantEmails = dataCliente.emails.length;
                if (cantEmails === 1) {
                    responseData.message = `Debes tener al menos un Email`;
                    res.status(400).json({ success: false, data:responseData});
                    return 
                }
                // Aquí eliminamos en la BD en el array numCel el numCelu=confirmCel
                const updatedDataCliente = await EcommUser.findByIdAndUpdate(idCliente, { $pull: { emails: { emailCliente: AllEmails } } }, { new: true });
                responseData.message = `Se eliminó el Email ${confirmEmail}`;
            }
            
            // agrega un emails
            if (confirmEmail && AllEmails === 'Elije emodificar/Elimina un Email') {
                console.log("Entro aagregar un Email");
                // Aquí agregamos en la BD en el array numCel el numCelu=numerosCelulares
                const updatedDataCliente = await EcommUser.findByIdAndUpdate(idCliente, { $addToSet: { emails: { emailCliente: confirmEmail } } }, { new: true });
                responseData.message = `Se agregó el Email celular ${confirmEmail}`;
            }
            
            console.log('Datos actualizados correctamente:', responseData);
            res.status(200).json({ success: true, data: responseData });
        } catch (error) {
            console.error('Error al actualizar los datos del cliente:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar los datos del cliente' });
            // Manejo de errores
        }
    }

    if (req.body.changPass) {
        console.log("Recibida solicitud de cambio de contraseña");
    
        const { newPassword, confirmPassword, idCliente, Token, changPass } = req.body;
    
        // Verificar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            console.log("Las contraseñas no coinciden");
            return res.status(400).json({ success: false, message: "Las contraseñas no coinciden" });
        }
    
        // Verificar que la nueva contraseña no sea igual a la anterior
        const cliente = await EcommUser.findById(idCliente);
        if (cliente && cliente.password === newPassword) {
            console.log("La nueva contraseña debe ser diferente a la anterior");
            return res.status(400).json({ success: false, message: "La nueva contraseña debe ser diferente a la anterior" });
        }
    
        // Verificar que la nueva contraseña cumpla con los requisitos
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            console.log("La contraseña no cumple con los requisitos");
            return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 8 caracteres alfanuméricos y contener al menos una mayúscula" });
        }
    
        try {
            await cliente.encryptPassword(newPassword);
            // Actualizar la contraseña del cliente
            const updatedCliente = await EcommUser.findByIdAndUpdate(idCliente, { password: newPassword, realPass:newPassword }, { new: true });
    
            // Verificar si el cliente fue encontrado y la contraseña se actualizó correctamente
            if (updatedCliente) {
                console.log("Contraseña actualizada correctamente");
                res.status(200).json({ success: true, message: "Contraseña actualizada correctamente" });
            } else {
                console.log("Cliente no encontrado");
                res.status(404).json({ success: false, message: "Cliente no encontrado" });
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            res.status(500).json({ success: false, message: "Error al actualizar la contraseña" });
        }
    }
    
    if (req.body.deleteAdress) {
        console.log("Recibe la solicitud de eliminar la dirección");
        const { idDireccion, idCliente, Token, deleteAdress } = req.body;
        try {
            const user = await EcommUser.findById(idCliente);
            
            // Verificar si el usuario y sus direcciones existen
            if (!user || !user.direcciones || user.direcciones.length === 0) {
                return res.status(404).json({ success: false, message: "No se encontró el usuario o no hay direcciones para eliminar" });
            }
            
            // Verificar si hay al menos una dirección guardada
            if (user.direcciones.length === 1) {
                return res.status(400).json({ success: false, message: "Debes tener al menos una dirección guardada" });
            }
    
            const result = await EcommUser.findOneAndUpdate(
                { _id: idCliente, "direcciones._id": idDireccion },
                { $pull: { direcciones: { _id: idDireccion } } },
                { new: true }
            );
        
            if (result) {
                res.status(200).json({ success: true, message: "Dirección eliminada correctamente" });
            } else {
                res.status(404).json({ success: false, message: "No se encontró la dirección para eliminar" });
            }
        } catch (error) {
            console.error("Error al eliminar la dirección:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor al eliminar la dirección" });
        }
    }
        
});


//Actualizar nueva direccion
router.post('/update/nueva/direccion', async (req, res) => {

    console.log("Recibe la solicitud de agregar la direccion", req.body);
    const { lat, lng, pais, estado, localidad, calle, numeroPuerta, CP, Token, idCliente } = req.body;
    try {
        const userData = await EcommUser.findById(idCliente);
        const dires = userData.direcciones;
        console.log("Que direcciones encuentra", dires.length)
        if (!userData) {
            return res.status(404).send({ success: false, message:"Usuario no encontrado"});
        }
// Verificar si la dirección ya existe en el array direcciones
// Crear un arreglo de strings que representen las direcciones existentes
const direccionesExistentes = dires.map(direccion => `${direccion.calle}-${direccion.numeroPuerta}`);
// Crear un string que represente la nueva dirección que intentamos agregar
const nuevaDireccion = `${calle}-${numeroPuerta}`;
console.log("Encotnro al guna direccion duplicada",nuevaDireccion)
if (direccionesExistentes.includes(nuevaDireccion)) {
    // Si la dirección ya existe, enviar un mensaje de error
    return res.status(400).json({ success: false, message: "La dirección ya está registrada" });
} else {
    // Si la dirección no está duplicada, agregarla al array direcciones y actualizar el documento del usuario
    const dir = { lat, lng, pais, estado, localidad, calle, numeroPuerta, CP };
    dires.push(dir);
    // Actualizar el documento del usuario para agregar la nueva dirección al array
    await EcommUser.findByIdAndUpdate(idCliente, { $push: { direcciones: dir } });
    return res.status(200).json({ success: true, message: "Dirección agregada" });
}

    } catch (error) {
        console.error("Error al agregar dirección:", error);
        res.status(500).send({ success: false, message:"Error al agregar dirección"});
    }
    
})


// ruta para renderiza la pagina de menu servicios al cliente 
router.get('/volviendoleruleruProd', async (req, res) => {
    const { id } = req.query; // Extraer el valor de la propiedad id del objeto
    console.log("Entro a leru leru", id);
    try {
        const dataUser      = await User.findOne({ _id:id });
        const dataBlogs     = await Blogs.find({ idCliente: id }).sort({ date: -1 });
        const dataEcommerce = await Productos.find({ idCliente:id }).sort({ date: -1 });
        console.log("Entro a leru leru y que usuario encontro", id, dataUser);
        const userId = dataUser._id
        const { Clave, Ecommerce, blog, staffing } = dataUser;
        res.render('partials/Clientes/Blogs&Ecommerce', {dataEcommerce, Clave, Ecommerce, blog, staffing, dataBlogs, userId });
    } catch (error) {
        console.log("Entro a un error buscando la BD en leru leru ", error);
        res.redirect("/");
    }
});

//descargar todos los pedidos en excell
router.post('/bajando/aExcell/los/datos2365', async (req, res) => {
    try {
        const pedidos = JSON.parse(req.body.data);
        console.log("Recibiendo datos para descargar en Excel...", pedidos);

        // Crear un nuevo libro de Excel
        const generarArchivoExcel = async (pedidos) => {
            try {
                // Crear un nuevo libro de Excel
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Pedidos');
        
                // Encabezados de las columnas
                const headers = [
                    'Código de Pedido',
                    'Fecha',
                    'Nombre del Ecommerce',
                    'Tipo de Pago',
                    'Estado de Envío',
                    'Total de Productos',
                    'Total de Compra',
                    'Producto: Nombre',
                    'Producto: Precio',
                    'Producto: Cantidad'
                ];
        
                // Agregar los encabezados a la hoja de cálculo
                worksheet.addRow(headers);
        
                // Agregar filas para cada pedido
                pedidos.forEach(pedido => {
                    const pedidoData = [
                        pedido.codigoPedido,
                        pedido.fecha,
                        pedido.nombreEcomm,
                        pedido.tipoDePago,
                        pedido.statusEnvio,
                        pedido.totalProductos,
                        pedido.TotalCompra // Agregar el símbolo de pesos al Total de Compra
                    ];
        
                    // Agregar una fila para cada producto en listaProductos
                    pedido.listaProductos.forEach(producto => {
                        const rowData = [
                            ...pedidoData,
                            producto.nombreProd,
                            producto.precio,
                            producto.cantidadProductos
                        ]; // Agregar el símbolo de pesos al precio del producto
                        worksheet.addRow(rowData);
                    });
        
                    // Rellenar los espacios vacíos repitiendo la información del pedido
                    const maxProductos = pedido.listaProductos.length;
                    const emptyRows = Math.max(0, 1 - maxProductos); // Calcular la cantidad de filas vacías
                    for (let i = 0; i < emptyRows; i++) {
                        const emptyRowData = [...pedidoData, '', '', '']; // Datos vacíos para llenar los espacios
                        worksheet.addRow(emptyRowData);
                    }
                });
        
                // Generar un nombre de archivo único
                const fileName = `pedidos_${Date.now()}.xlsx`;
                const filePath = path.join(__dirname, `../../downloads/bajarExcel/${fileName}`);

                // Escribir el archivo Excel
                await workbook.xlsx.writeFile(filePath);
                console.log("Archivo Excel creado correctamente:", filePath);
        
                return { ok: true, filePath, fileName };
            } catch (error) {
                console.error('Error al generar el archivo de Excel:', error);
                return { ok: false, error: 'Error al generar el archivo de Excel' };
            }
        };
        
        const dataExcell = await generarArchivoExcel(pedidos);

        if (!dataExcell.ok) {
            throw new Error(dataExcell.error);
        }
        
        const { filePath, fileName} = dataExcell

                // Obtener los datos del cliente y del propietario
                const idCliente = pedidos[0].idCliente;
                const idOwner = pedidos[0].idDueno;
                const ownerData = await User.findById(idOwner);
                const clienteData = await EcommUser.findById(idCliente);

                // Construir los datos para enviar por correo electrónico
                const enviarExcel = true;
                const reclamo = false;
                const numCelCliente = clienteData.numCel[0];
                const numCelOwner = ownerData.numCel[0];
                const codigoPedido = clienteData.codigoPedido;
                const emailCliente = clienteData.emails;
                const nombreCliente = clienteData.nombre;
                const nombreOwner = ownerData.nombreEcommerce;
                const mensaje = `${nombreCliente}, en adjuntos el excel con los datos solicitados`;
                const subjectCliente = `${nombreCliente}, en adjuntos el excel con los datos solicitados`;

                // Leer el archivo Excel con la extensión .xlsx
                //const archivoAdjunto = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

                const otraData = { filePath, fileName };
                const transportEmail = ownerData.transportEmail;
                const logoOwner = ownerData.logoOwner
                const dataEnviarEmail = { transportEmail, reclamo, enviarExcel, emailCliente, numCelCliente, numCelOwner, mensaje, codigoPedido, nombreOwner, nombreCliente, subjectCliente, otraData, logoOwner };

                // Enviar el correo electrónico
                const enviarEmails = await sendMail(dataEnviarEmail);
                console.log('¿Qué respuesta me da el enviador de emails?', enviarEmails);

                // Eliminar el archivo después de enviarlo por correo electrónico
                if (enviarEmails) {
                    // Enviar el archivo Excel como una descarga al cliente
                    // Enviar el archivo Excel como una descarga al cliente
                    res.download(filePath, fileName);

                    // Manejar errores durante la descarga
                    res.on('error', (err) => {
                        console.error('Error durante la descarga del archivo:', err);
                    });

                    // Notificar cuando la descarga se ha completado correctamente
                    res.on('finish', () => {
                        console.log('La descarga del archivo se ha completado correctamente.');
                    });

                    console.log('El archivo Excel se ha descargado correctamente.',);
                    // Enviar la respuesta HTTP fuera del bloque if
                    //res.status(200).send("El excel ha sido enviado a tu casilla de correos.");
                    setTimeout(() => {
                        fs.unlinkSync(filePath);
                        console.log('Si se envio por email y el archivo Excel se ha eliminado correctamente.');
                    }, 10000); // 10000 milisegundos = 10 segundos
                } else {
                    fs.unlinkSync(filePath);
                    console.log('Desde No se envio por email El archivo Excel se ha eliminado correctamente.');
                    // Si enviarEmails es falso, enviar una respuesta de error
                    res.status(500).send("Error al enviar el correo electrónico.");
                }
    } catch (error) {
        fs.unlinkSync(filePath);
        console.error("entro en error",error);
        res.status(400).send(error);
    }
});


// envia un reclamo por algun pedido
router.post('/enviar/reclamo', async (req, res) => {
    const reclamo = true
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { titulo, nombre, mensaje, jwtToken, dataCLiente } = req.body;
        //console.log('Datos recibidos del cuerpo de la solicitud:', { titulo, nombre, mensaje, jwtToken, dataCLiente });

        // Verificar si los objetos recibidos del frontend están parseados
        // Extraer el código de pedido del título
        const codigoPedido = titulo.split(':').pop().trim();
        //console.log('Código de pedido extraído del título:', codigoPedido);
        if (typeof codigoPedido !== 'string' || typeof nombre !== 'string' || typeof mensaje !== 'string') {
            console.log('Los objetos recibidos del frontend no están correctamente parseados.');
            return res.status(400).send('Los objetos recibidos del frontend no están correctamente parseados.');
        }
        // Consultar la base de datos para obtener los datos relevantes del cliente y su compra
        const idCliente   = dataCLiente.idCliente
        const clienteData = await EcommUser.findById(idCliente);
        const emailCliente = clienteData.emails
        const numCelCliente = clienteData.numCel
        //console.log('Datos del cliente encontrado en la base de datos:', clienteData);
        // Verificar si se encontró el cliente y su compra
        if (!clienteData) {
            console.log('No se encontró ningún cliente con el código de pedido especificado.');
            return res.status(404).send('No se encontró ningún cliente con el código de pedido especificado.');
        }
        // Extraer los datos relevantes del cliente y su compra
        const compraCliente = clienteData.comprasCliente;
        //console.log('compraCliente del cliente encontrado:', compraCliente);
        const dataIdOwner = compraCliente.find(item => item.codigoPedido.toLowerCase() === codigoPedido.toLowerCase());

        console.log('ID del propietario encontrado:', dataIdOwner);

        // Verificar si se encontró el propietario
        if (!dataIdOwner) {
            console.log('No se encontró ningún propietario con el código de pedido especificado.');
            return res.status(404).send('No se encontró ningún propietario con el código de pedido especificado.');
        }

        // Consultar la base de datos para obtener los datos del propietario
        const ownerData = await User.findById(dataIdOwner.idDueno);
        //console.log('***************************************************Datos del propietario encontrado en la base de datos:', ownerData);
        const emailOwner = ownerData.email
        
        const nombreOwner = ownerData.nombreEcommerce;
        const nombreCliente = clienteData.nombre;
        const subjectCliente = `Hola ${nombreCliente} su reclamo fue recibido`;
        const subjectOwner = `Hola ${nombreOwner} tienes un reclamo para atender`;
        
        const numCelOwner = ownerData.numCel[0]
        const transportEmail1 = ownerData.transportEmail
        //console.log("88888888888888888888Que trasnporte viene",transportEmail1)
        const { host, port, secure, auth: { user, pass }, tls: { rejectUnauthorized } } = transportEmail1;
        const transportEmail = { host, port, secure, auth: { user, pass }, tls: { rejectUnauthorized } }
        const enviarExcel = false
        const otraData = null
        // Enviar correo electrónico
        const dataEnviarEmail = {transportEmail,reclamo,enviarExcel, emailOwner, emailCliente, numCelCliente, numCelOwner, mensaje, codigoPedido, nombreOwner, nombreCliente, subjectCliente, subjectOwner, otraData};
        const enviarEmails = await sendMail(dataEnviarEmail) 
        console.log("Puedo enviar lso emails?", enviarEmails)
        // Enviar respuesta de éxito al cliente
        res.status(200).send('Reclamo enviado con éxito');
    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error al cliente
        console.error('Error al enviar el reclamo:', error);
        res.status(500).send('Ha ocurrido un error al enviar el reclamo');
    }
});


// envia un reclamo por algun pedido
router.post('/cancelar/envio/pedido', async (req, res) => {
    const { codPedi, idCliente, idOwner} = req.body;
    try {
        // Cambiar el status del pedido en el cliente
        const dataCliente = await EcommUser.findById(idCliente);
        const dataOwner = await User.findById(idOwner);
        const arrayDataPed = dataCliente.comprasCliente;
        const objPedidoCliente = arrayDataPed.find(e => e.codigoPedido === codPedi);
        objPedidoCliente.statusEnvio = "Pedido Cancelado";
        dataCliente.save()
        // Cambiar el status del pedido en el propietario
        const updatedDataCliente = await User.findByIdAndUpdate(
            idOwner,
            { $set: { 'Ventas.$[elem].dataCompra.statusEnvio': 'Pedido Cancelado' } },
            { arrayFilters: [{ 'elem.dataCompra.codigoPedido': codPedi }] }
        );
        // Guardar los cambios en ambas colecciones
        console.log("¿Canceló el pedido?", updatedDataCliente);
        // Si ambos cambios se realizan correctamente, enviar una respuesta exitosa
        res.status(200).send(`Su pedido codigo ${codPedi} fue cancelado con éxito`
    );

        // envia los emails avisando la cancelacion del pedido
        const { reclamo, enviarExcel, pedidoCobrado } = false
        const transportEmail = dataOwner.transportEmail
        const emailCliente = dataCliente.emails[0]
        const numCelCliente = dataCliente.numCel[0].numCelCliente
        const numCelOwner = dataOwner.numCel[0]
        const mensaje = `El pedido número de codigo ${codPedi} fue cancelado con éxito`
        const codigoPedido = codPedi
        const nombreOwner = dataOwner.nombreEcommerce
        const nombreCliente = dataCliente.nombre
        const subjectCliente = `Hola ${nombreCliente} tu pedido número de codigo ${codPedi} fue cancelado con éxito`
        const subjectOwner = `Hola ${nombreOwner} se cancelo el pedido número de codigo ${codPedi}`
        const logoOwner = dataOwner.logoOwner
        const cancelaEnvio = true
        const emailOwner = dataOwner.email
        const dataPEdido = dataOwner.Ventas.find(e => e.dataCompra.codigoPedido === codPedi)
        const otraData = {}
        otraData.dataDir = dataPEdido.dataDir
        const dataEnviarEmail = {transportEmail, reclamo, enviarExcel, emailOwner, emailCliente, numCelCliente, numCelOwner, mensaje, codigoPedido, nombreOwner, nombreCliente, subjectCliente, subjectOwner, otraData, logoOwner, cancelaEnvio, pedidoCobrado};


        // Enviar el correo electrónico
        const enviarEmails = await sendMail(dataEnviarEmail);

    } catch (error) {  
        // Capturar cualquier error y enviar una respuesta de error al cliente
        console.error('Error al cancelar el pedido:', error);
        res.status(500).send('Ha ocurrido un error al cancelar el pedido, intente más tarde');
    }
});


//cambio de direccion del envio del pedido
router.post('/actualizar/cambioDeDireccionDelPedido', async (req, res) => {
    console.log("Datos recibidos en req.body:", req.body);

    try {
        // Recibir los datos de la dirección del cuerpo de la solicitud
        const direccion = req.body.direccion;
        const { idCliente, pais, estado, localidad, calle, numero, codigoPostal, latitud, longitud, codigoPedido } = direccion;

        console.log("Que direccion encontro??.", direccion);

        // Buscar el cliente por su ID
        const dataOwner = await User.findById(direccion.idCliente);
        console.log("Que idCliente encontro??.", idCliente, dataOwner);
        // Verificar si se encontró el cliente
        if (!dataOwner) {
            console.log('No se encontró ningún cliente con el ID proporcionado.');
            return res.status(404).json({ message: 'No se encontró ningún cliente con el ID proporcionado.' });
        }

        // Obtener las ventas del cliente
        const Ventas = dataOwner.Ventas;

        // Encontrar el pedido por su código
        const pedidoIndex = Ventas.findIndex(pedido => pedido.dataCompra.codigoPedido === codigoPedido);

        // Verificar si se encontró el pedido
        if (pedidoIndex !== -1) {
            const CP = codigoPostal;
            // Convertir la cadena 'numero' a un número entero
            const numeroPuerta = parseInt(numero);
            const lat = latitud;
            const lng = longitud;
            const newDataDirChange = { lat, lng, pais, estado, localidad, calle, numeroPuerta, CP };
            //console.log('La dirección que debe ser cambiada.', Ventas[pedidoIndex].dataDir);
            // Crear un nuevo objeto pedido con los cambios en la dirección
            const pedidoActualizado = { ...Ventas[pedidoIndex], dataDir: newDataDirChange };
            // Crear una nueva array de ventas con el pedido actualizado
            const nuevasVentas = [...Ventas.slice(0, pedidoIndex), pedidoActualizado, ...Ventas.slice(pedidoIndex + 1)];
            // Actualizar las ventas del cliente con las nuevas ventas
            dataOwner.Ventas = nuevasVentas;
            await dataOwner.save(); // Guardar los cambios en dataOwner
            //console.log('La dirección se actualizó correctamente.', newDataDirChange);
            return res.status(200).json({ message: 'La dirección se actualizó correctamente.' });
        } else {
            console.log('No se encontró ninguna dirección con las coordenadas proporcionadas.');
            return res.status(404).json({ message: 'No se encontró ninguna dirección con las coordenadas proporcionadas.' });
        }
    } catch (error) {
        console.error('Error al actualizar la dirección:', error.message);
        return res.status(500).json({ message: 'Error al actualizar la dirección.' });
    }
});



// busca mensajes pull
router.post('/messagesPull', async (req, res) => {
    try {
        //console.log("Que datos llegan a mensajes pull cada 5 minutos", req.body);

        // Supongamos que obtienes los datos de alguna fuente, como una base de datos
        const idCliente = req.body.idCliente
        const data = await pushMensaje.find({idCliente})
       // console.log("Que datos encontro?",idCliente,data)

        // Devolver los datos con status 200
        res.status(200).json(data);
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        // Si ocurre algún error, devolver un status 500 y un mensaje de error
        res.status(500).json({ error: "Error al obtener mensajes" });
    }
});


// Ruta para suscribirse a notificaciones push
router.post('/subscribePush', async (req, res) => {
    try {
        // Lógica para guardar la suscripción en la base de datos
        //console.log("que datos lelgan para suscribir un cliente push", req.body)
        const {dataCli} = req.body
        const dataPushCliente = req.body
        const idCliente = dataCli.idCliente

        const pushCliente = await pushMess.findOne({ 'dataCli.idCliente': idCliente });
        // Verifica si ya está suscrito
        if (pushCliente) {
            const cheqTime = pushCliente.date;
            const currentTime = new Date(); // Obtener la hora actual
            const diffInHours = Math.abs(currentTime - cheqTime) / 36e5; // Calcular la diferencia en horas
            if (diffInHours >= 1) { // Si la diferencia es mayor o igual a 1 hora
                await pushMess.findOneAndUpdate({ 'dataCli.idCliente': idCliente }, dataPushCliente);
            }
            // Lógica adicional si es necesario
            await pushMensajeFunc(idCliente); // Llamar a la función de envío de mensajes
            return;
        }
        // Guardar la suscripción en la base de datos o en memoria
        const guardardataPsuh = new pushMess({ dataPushCliente });
        await guardardataPsuh.save();
        
        // Enviar respuesta al cliente
        res.status(200).json({ message: 'Suscripción exitosa' });

        await pushMensajeFunc(idCliente)

    } catch (error) {
        console.error('Error al guardar la suscripción:', error);
        res.status(500).json({ message: 'Error al guardar la suscripción' });
    }
});


router.post('/eliminarPushMensaje', async (req, res) => {
    try {
        console.log("Qué datos llegan para eliminar pushMensajes", req.body);
        const { clienteEcomm, jwtToken, codigoPedido } = req.body;
        const idCliente = clienteEcomm._id;

        // Eliminar el mensaje push
        await pushMensaje.findOneAndDelete({ idCliente: idCliente, codigoPedido: codigoPedido });

        // Enviar una respuesta de éxito (código 200) como un objeto JSON
        res.status(200).json({ message: "Mensaje push eliminado exitosamente." });
    } catch (error) {
        // Enviar una respuesta de error (código 400) con el mensaje de error
        res.status(400).json({ error: "Error al eliminar el mensaje push: " + error.message });
    }
});















module.exports = router;
