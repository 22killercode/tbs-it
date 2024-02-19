require('dotenv').config();
const express   = require('express');
const router    = express.Router(); 
const passport  = require('passport');
const fs = require('fs');
const path = require('path');  // Asegúrate de agregar esta línea
const axios = require("axios")

//models
const User = require('../models/User');
const Blogs = require('../models/blogs');

//helpers
const { isAuthenticated } = require('../helpers/auth');


// ruta para ingresar cientes y emplpeados
router.post('/users/signIN/clientesyempleados', passport.authenticate('local',
    {
        successRedirect: '/cofiguratiosBolgsProductsEildamais',
        failureRedirect: '/',
        failureFlash: true
    })
);


// ruta para ingresar al menu de blogs y Ecommerce
router.get('/cofiguratiosBolgsProductsEildamais', isAuthenticated, async (req, res) => {

    console.log("01 ingreso al menu principal Que llega ruta para ingresar al menu de blogs")

    //identificar si el usauario tiene permisos de administrador
    try {
        const {id} = req.user
        const dataUser = await User.findById(id)
        const {Clave, Ecommerce, blog, staffing} = dataUser
        //console.log("que encontro en dataUser", dataUser)
        const dataBlogs = await Blogs.find({ idCliente: id }).sort({ date: -1 });

        if (Clave) {
            //console.log("Administrador",Clave, Ecommerce, blog, staffing)
            res.render('partials/Clientes/Blogs&Ecommerce', {Clave, Ecommerce, blog, staffing, dataBlogs})
        }
        else{
            const Clave = false
            //console.log("NO Administrador")
            res.render('partials/Clientes/Blogs&Ecommerce', {Clave, Ecommerce, blog, staffing, dataBlogs})
        }
            
    } catch (error) {
        console.log("****Solo agrega clientes", error)
        res.redirect('/')
        // cebador
        //  const clave = true
        //  res.render('partials/Clientes/Blogs&Ecommerce', {clave})
    }
});

// ruta para inscribir cientes y empleados
router.post('/users/signUP/clientesyempleados', isAuthenticated, async (req, res) => {
    const {email, password, nombre, apellido, empresa, Clave, blog, staffing, Ecommerce} = req.body
    //console.log("QUE HAY EN REQ.BODY???",req.body)
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


// para armar NUEVOS blogs
router.post('/crearCarpetayGurdarBlog',  async (req, res) => {
    console.log("000 /crearCarpetayGurdarBlog recibiendoDatosdelBlog que hay en req.body", req.body);
    // revisar que llega toda la info dle frontend
    const {titulo, mensaje, tamanoImg, id} = req.body
    console.log("02 que empresa encontro", req.files, titulo, mensaje, tamanoImg, id);
    try {
        // busca la informacion del cliente que quiere emitir un nuevo blog
        const usuario = await User.findById(id);
        const empresa = usuario ? usuario.empresa : null;
        const cheqCantidadBlogs = usuario.Blogs.length
        // revisa si ya tiene los 10 blogs maximos permitidos
        if (cheqCantidadBlogs >= 10) {
            const errorMessage = "Ya tienes 10 o más blogs cargados. Edita o elimina algunos";
            console.error(errorMessage);
            // Enviar un código de estado 400 (Bad Request) y el mensaje de error al frontend
            return res.status(400).json({ error: errorMessage });
            //req.flash('error', 'Ya tienes 10 o mas blogs cargados edita o elimina algunos');
            //res.status(500).json({ error: 'Ya tienes 10 o mas blogs cargados edita o elimina algunos' });
            //res.redirect("/cofiguratiosBolgsProductsEildamais")
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
            const idCliente = id
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
                    return res.status(200).json({ message: "El  Blog se cargo exitosamente" });
                    //res.redirect("/cofiguratiosBolgsProductsEildamais")
                } catch (error) {
                    console.log(" El  blog NO se guardo en la BD",error )
                }
            }else{
                console.error("El blog NO se guardo en el server Dovemailer ni la BD", error);
                console.log("El  blog NO se guardo en el server Dovemailer ni la BD")
            }
    } catch (error) {
        console.error("Error al procesar la solicitud a final de todo:", error);
        res.status(500).json({ success: false, message: error });
        //res.redirect("/")
    }

});

// para eliminar blogs
router.delete('/eliminarBlog/:id', isAuthenticated, async (req, res) => {
    try {
        // Eliminar el blog por su ID
        const dataBlog = await Blogs.findByIdAndDelete(req.params.id, {new: true});

        // Actualizar el array de Blogs del usuario, removiendo el blog eliminado
        await User.findByIdAndUpdate(req.user.id, { $pull: { Blogs: req.params.id } });

        // Tengo que eliminar la foto del archivo
        const pathBorrar = dataBlog.pathImg;

        // Utiliza fs.unlink para eliminar el archivo
        fs.unlink(pathBorrar, (error) => {
            if (error) {
                console.error("Error al eliminar la foto:", error);
                res.status(500).json({ success: false, message: "Hubo un error al eliminar la foto." });
            } else {
                console.log("La foto fue eliminada correctamente.");
                res.status(200).json({ success: true, message: "El blog y la foto fueron eliminados correctamente." });
            }
        });

        console.log("El blog ha sido borrado");
    } catch (error) {
        console.log("Ocurrió un error al borrar el blog", error);
        res.status(500).json({ success: false, message: "Hubo un error al borrar el blog." });
    }
});

// para editar los inputs del blogs
router.post('/editarBlog', isAuthenticated, async (req, res) => {
    const {titulo, mensaje, id} = req.body
    console.log("Llego a actualizar",{titulo, mensaje, id});
    try {
        await Blogs.findByIdAndUpdate(id, {titulo, mensaje});
        console.log("El blog ha sido actualizado");
        res.redirect("/cofiguratiosBolgsProductsEildamais#opcion3");
    } catch (error) {
        console.log("Ocurrió un error al actualizar el blog", error);
        res.redirect("/cofiguratiosBolgsProductsEildamais#opcion3");
    }

});

//cambiar imagen
router.post('/cambiarnuevaImagen/:id', isAuthenticated, async (req, res) => {
    const imagen = req.files
    const tamanoImg = req.body
    try {
        // obtener datos del usuario
            const Usuario = await User.findById(req.user.id);
            const empresa = Usuario ? Usuario.empresa : null;

        // tengo que eliminar la foto dle archivo
            const dataBlog = await Blogs.findById(req.params.id);
            const pathBorrar = dataBlog.pathImg
            // Utiliza fs.unlink para eliminar el archivo
            fs.unlink(pathBorrar, (error) => {
                if (error) {
                    console.error("Error al eliminar la foto:", error);
                    // Puedes enviar una respuesta al cliente indicando el error
                    res.status(500).json({ success: false, message: "Hubo un error al eliminar la foto." });
                } else {
                    console.log("La foto fue eliminada correctamente.");
                    // Puedes enviar una respuesta al cliente indicando el éxito
                    res.status(200).json({ success: false, message: "La foto fue eliminada correctamente." });
                    // res.json({ success: true, message: "La foto fue eliminada correctamente." });
                }
            });

        // tengo que cambiar los path de la fotos en la bd
            const pathImg = path.join(__dirname, `../uploads/${empresa}/${imagen.name}`);
            const rutaSimple = `/${empresa}/${imagen.name}`;
            await Blogs.findByIdAndUpdate(req.params.id, {pathImg, rutaSimple, tamanoImg});
            console.log("llego a cambiar imagen que trae el params", req.params.id, req.files )
        
        // mueve la foto a la carpeta
            imagen.nuevaImagen.mv(pathImg, async function(err){
                if (err){
                    console.log('hay un error en la subida de la imagen a la carpeta',err);
                }
                else {
                console.log("la carpeta ha sido creada exitosamente")
                }
            });
    }
    catch (error) {
        console.error("Error al procesar la solicitud de cambio de imagen:", error);
        res.status(500).send("Error interno del servidor");
    }

    finally{
        res.status(200).send("La imagen fue cambiada exitosamente");    
        // res.redirect("/cofiguratiosBolgsProductsEildamais#opcion3");
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



