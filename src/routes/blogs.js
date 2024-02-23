require('dotenv').config();
const express   = require('express');
const router    = express.Router(); 
const passport  = require('passport');
const fs = require('fs');
const path = require('path');  // Asegúrate de agregar esta línea
const axios = require("axios")
const mongoose = require('mongoose');

//models
const User = require('../models/User');
const Blogs = require('../models/blogs');


// ruta para ingresar cientes y emplpeados
// router.post('/users/signIN/clientesyempleados222222222222', passport.authenticate('local',
//     {
//         successRedirect: '/cofigurasionesBolgsProductsEildamais',
//         failureRedirect: '/',
//         failureFlash: true
//     })
// );


// ruta para ingresar cientes y emplpeados
router.post('/users/signIN/clientesyempleados', (req, res) => {
    const {email} = req.body
    res.redirect(`/configuracionesBlogsProductsEildamais?email=${encodeURIComponent(email)}`);
});


// ruta para ingresar al menu de blogs y Ecommerce
router.get('/configuracionesBlogsProductsEildamais', async (req, res) => {

    //identificar si el usauario tiene permisos de administrador
    try {
        const  email  =  req.query.email;
        const dataUser = await User.findOne({email:email})
        console.log("que encontro en dataUser", dataUser)
        const {Clave, Ecommerce, blog, staffing, _id} = dataUser
        const userId = _id
        const dataBlogs = await Blogs.find({ idCliente:_id }).sort({ date: -1 });

        if (Clave) {
            console.log("Administrador",Clave, Ecommerce, blog, staffing)
            res.render('partials/Clientes/Blogs&Ecommerce', {Clave, Ecommerce, blog, staffing, dataBlogs, userId})
        }
        else{
            const Clave = false
            console.log("NO Administrador")
            res.render('partials/Clientes/Blogs&Ecommerce', {Clave, Ecommerce, blog, staffing, dataBlogs, userId})
        }
            
    } catch (error) {
        console.log("****Solo agrega clientes", error)
        res.redirect('/')
    }
    // // cebador
    // const Clave = true
    // res.render('partials/Clientes/Blogs&Ecommerce', {Clave})
    // console.log("01 ingreso al menu principal Que llega ruta para ingresar al menu de blogs")
});


router.post('/users/signUP/clientesyempleados', async (req, res) => {
    console.log("QUE HAY EN REQ.BODY? de SIGNUP??",req.body)    
})


// ruta para inscribir cientes y empleados
router.post('/users/signUP/clientesyempleados22', async (req, res) => {
    console.log("QUE HAY EN REQ.BODY? de SIGNUP??",req.body)
    const {email, password, nombre, apellido, empresa, Clave, blog, staffing, Ecommerce} = req.body
    try {
        const newUser    = new User({email, password, nombre, apellido, empresa, Clave, blog, staffing, Ecommerce});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        console.log("El usuario se cargo bien")
    } catch (error) {
        console.log("No se puedo cargar correctamente el usuario",error)
    }
    // aqui hay que avisar si se cargo bien o no el usuario y salir a la pagina principal

    res.redirect("/")
});


// para armar NUEVOS blogs con AXIOS
router.post('/crearCarpetayGurdarBlog',  async (req, res) => {
    console.log("000 /crearCarpetayGurdarBlog recibiendoDatosdelBlog que hay en req.body", req.body);
    // revisar que llega toda la info dle frontend
    const {titulo, mensaje, tamanoImg, id} = req.body
    const idCliente = id
    console.log("02 que empresa encontro", req.files, titulo, mensaje, tamanoImg, id);
    try {
        // busca la informacion del cliente que quiere emitir un nuevo blog
        const usuario = await User.findById(id);
        const empresa = usuario ? usuario.empresa : null;
        const cheqCantidadBlogs = usuario.Blogs.length
        // revisa si ya tiene los 10 blogs maximos permitidos
        console.log("Cuantos blogs tiene cargados.", cheqCantidadBlogs);
        if (cheqCantidadBlogs >= 10) {
            const idUser = idCliente
            console.log("Tienes mas de 10 blogs cargados elimina algunos por favor.");
            req.flash("error","Tienes mas de 10 blogs cargados elimina algunos por favor.")
            res.redirect(`/volviendoleruleru?id=${idUser}`)
            return
        }
        console.log("0 que empresa encontro", empresa);
        // Enviar solicitud a Dovemailer Cloud Archivos usando AXIOS
        async function enviarImagenAServidorB(imagen, ob1, ob2) {
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
                
                // 3. Enviar la imagen y los objetos al servidor B
                const urlServidorB = 'http://localhost:3009/crearCarpetayGurdarBlog'; // Reemplaza con la URL correcta de tu servidor B
                const respuesta = await axios.post(urlServidorB, datosAEnviar);
                // 4. Manejar la respuesta del servidor B
                console.log('Respuesta del servidor B:', respuesta.data);
                return respuesta.data
                } catch (error) {
                console.error('Error al procesar la solicitud:', error.message);
                }
            }
              // Llamada a la función con los datos necesarios
            const cheq = await enviarImagenAServidorB(req.files.imagen, empresa, id);        
            console.log("QUE CARAJOS TIENE CHEQ", cheq)
            // guardar info en la BD
            if (cheq.datos.ok && cheq.datos.id === idCliente) {
                console.log("Entro a carga el blog a la BD")
                try {
                    const {rutaSimple, rutaSimple2, rutaCompleta} = cheq.datos
                    const rutaBase     = `http://localhost:3009/`;
                    const rutaRelativa = (` ${rutaBase}${rutaSimple2}`);
                    const rutaURL      = rutaRelativa;
                    const pathImg      = rutaCompleta
                    console.log("Que ruta URL fabrico",rutaURL);
                    const newBlog = new Blogs({rutaURL, titulo, mensaje, pathImg, rutaSimple, rutaSimple2, idCliente, tamanoImg});
                    const idBlog = newBlog.id
                    await newBlog.save();
                    console.log(" el  blog se cargo exitosamente")
                    // Actualizar el usuario para agregar el nuevo idBlog al array
                    const usuarioActualizado = await User.findByIdAndUpdate(
                        idCliente,
                        // Utilizar $push para agregar el nuevo idBlog al array
                        { $push: { Blogs: idBlog } },
                        { new: true } // Devolver el documento actualizado
                    );
                    console.log("El  Blog se cargo exitosamente", usuarioActualizado)
                    //return res.status(200).json({ message: "El  Blog se cargo exitosamente" });
                    req.flash("success_msg","El blog se cargo correctamente.")
                    const idUser = idCliente
                    res.redirect(`/volviendoleruleru?id=${idUser}`)
                    } catch (error) {
                    console.log(" El  blog NO se guardo en la BD",error )
                }
            }else{
                console.error("El blog NO se guardo en el server Dovemailer ni la BD", error);
                req.flash("error","El blog NO se cargo correctamente, intente mas tarde")
                const idUser = idCliente
                res.redirect(`/volviendoleruleru?id=${idUser}`)
                    }
    } catch (error) {
        console.error("Error al procesar la solicitud a final de todo:", error);
        req.flash("error","El blog NO se cargo correctamente, intente mas tarde")
        const idUser = idCliente
        res.redirect(`/volviendoleruleru?id=${idUser}`)
    }
});

// para eliminar blogs
// Enviar solicitud a Dovemailer Cloud Archivos usando AXIOS
router.post('/eliminarBlog',  async (req, res) => {
    console.log("Desde server TBS ingreso a borrar blog",req.body)
    try {

        const id = req.body.id
        const dataBlog = await Blogs.findById(id);
        dataBlog.date = "null"
        console.log("TBS ingreso cual blog econtro",dataBlog)
        const idCliente = dataBlog.idCliente
        const dataUser = await User.findById(idCliente)
        console.log("TBS ingreso cual dataUSer econtro",dataUser)
        // hace una llamada al server Dovemailer para elminar la imagen
        async function enviarImagenAServidorB(dataBlog) {
            console.log("Entro a la fucion de AXIOS para enviar al server de Dovemailer, enviarImagenAServidorB");
            try {
                // 3. Enviar la imagen y los objetos al servidor B
                const urlServidorB = 'http://localhost:3009/TBSeliminarImagen'; // Reemplaza con la URL correcta de tu servidor B
                const respuesta = await axios.post(urlServidorB, dataBlog);
                // 4. Manejar la respuesta del servidor B
                console.log('Respuesta del servidor B:', respuesta.data);
                return respuesta.data
            } catch (error) {
                console.error('Axios entro en error al procesar la solicitud:', error.message);
                return false
            }
        }
        const response = await enviarImagenAServidorB(dataBlog) 
        if (response) {
            // Eliminar el blog por su ID
            await Blogs.findByIdAndDelete(id);
            // Actualizar el array de Blogs del usuario, removiendo el blog eliminado de la BD User
            await User.findByIdAndUpdate({_id:idCliente}, { $pull: { Blogs: id } })
            // enviar estatus OK
            const idUser = dataUser._id
            req.flash("success_msg","El blog se elimino correctamente.")
            res.redirect(`/volviendoleruleru?id=${idUser}`);
            console.log("El blog ha sido borrado");
            return
        } else {
            return res.status(400).send("Error: El server de Dovemailer no respondio la eliminacion"); // o algún otro mensaje de error
        }
    } catch (error) {
        const idUser = dataUser._id
        console.log("Ocurrió un error al borrar el blog", error);
        req.flash("error","Hubo un error al borrar el blog., intentelo de nuevo mas tarde.")
        res.redirect(`/volviendoleruleru?id=${idUser}`)
        // res.status(500).json({ success: false, message: "Hubo un error al borrar el blog." });
    }
});


// ruta apra renderiza la pagina de menu servicios al cliente 
router.get('/volviendoleruleru', async (req, res) => {
    const { id } = req.query; // Extraer el valor de la propiedad id del objeto
    console.log("Entro a leru leru", id);
    try {
        const dataUser = await User.findOne({ _id: mongoose.Types.ObjectId(id) }) || await Blogs.findOne({ idCliente: id });
        const dataBlogs = await Blogs.find({ idCliente: id }).sort({ date: -1 });
        console.log("Entro a leru leru y que usuario encontro", id, dataUser);
        const userId = dataUser._id
        const { Clave, Ecommerce, blog, staffing } = dataUser;
        res.render('partials/Clientes/Blogs&Ecommerce', { Clave, Ecommerce, blog, staffing, dataBlogs, userId });
    } catch (error) {
        console.log("Entro a un error buscando la BD en leru leru ", error);
        res.redirect("/");
    }
});










// solicitando datos desde la pagina web
router.post('/buscandoPostdeBlogs', async (req, res) => {
    try {
        // accesos de seguridad
        const formData = req.body;
        console.log("llega la petición /buscandoPostdeBlogs", formData);

        if (formData === '147852369') {
            console.log("NO paso el filtro de seguridad");
            return res.status(400).json({ success: false, message: 'No tienes el ID de seguridad' });
        }

        // busca los datos de la BD de los blogs // CARGA EL EMAIL DEL CLIENTE DE LOS BLOGS
        const dataBlogs = await Blogs.find({ email: "sebastianpaysse@gmail.com" }).sort({ date: -1 });

        //console.log('Desde TBSIT dataSend recibidas:', dataBlogs);

        res.status(200).json({ success: true, data: dataBlogs });
    } catch (error) {
        console.error('Error handling the request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;



