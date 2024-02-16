require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs1 = require('fs');
const fs = require('fs-extra');
const scp2 = require('scp2');
const { exec } = require('child_process');
const path = require('path');
const shortid = require('shortid');
const Client = require('ssh2').Client; // Agregamos la importación de ssh2
const axios = require('axios');

//models
const User = require('../models/User');
const Blogs = require('../models/blogs');
// helpers
const helpers = require('../helpers/auth');
const { isAuthenticated } = require('../helpers/auth');

const bodyParser = require('body-parser');
router.use(bodyParser.text());


// para armar NUEVOS blogs
router.post('/crearCarpetayGurdarBlog', isAuthenticated, async (req, res) => {
    console.log("000 recibiendoDatosdelBlog que hay en req.body", req.body);
    // revisar que llega toda la info dle frontend
    //console.log("00 que empresa encontro", req.files);
    const { imagen } = req.files;
    const {titulo, mensaje, tamanoImg, id} = req.body

    try {
        // busca la informacion del cliente que quiere emitir un nuevo blog
        const usuario = await User.findById(req.user.id);
        const empresa = usuario ? usuario.empresa : null;
        const cheqCantidadBlogs = usuario.Blogs.length
        if (cheqCantidadBlogs >= 10) {
            req.flash('error', 'Ya tienes 10 o mas blogs cargados edita o elimina algunos');
            //res.redirect("/cofiguratiosBolgsProductsEildamais")
        }

        console.log("0 que empresa encontro", empresa);

        
        // Enviar solicitud a Dovemailer Cloud Archivos
        

        const axios = require('axios');

        async function enviarDatosAServidorB(data) {
          const urlServidorB = 'http://localhost:3010/crearCarpetayGurdarBlog'; // Reemplaza con la URL correcta de tu servidor B
            console.log("Entro a AXIOS");

            try {
            const response = await axios.post(urlServidorB, data);
            console.log('Respuesta del servidor B:', response.data);
            return response.data; // Puedes manejar la respuesta según tus necesidades

            } catch (error) {
            console.error('Error al enviar datos al servidor B:', error.message);
            throw error; // Puedes manejar el error según tus necesidades
            }
        }
        
            // Ejemplo de uso:
            const nombreCarpeta   = empresa;
            const datosParaEnviar = {imagen, nombreCarpeta, id };
            
            const cheq = await enviarDatosAServidorB(datosParaEnviar)

            console.log("QUE CARAJOS TIENE CHEQ", cheq)
            // guardar info en la BD
            const idCliente = req.user.id
            if (cheq.datos.id === idCliente) {
                console.log("Entro a carga el blog a la BD")
                const {rutaSimple, rutaSimple2, rutaCompleta} = cheq.datos
                try {
                const pathImg = rutaCompleta
                const newBlog = new Blogs({titulo, mensaje, pathImg, rutaSimple, rutaSimple2, idCliente, tamanoImg});
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
                console.log(" el  usuarioActualizado se cargo exitosamente", usuarioActualizado)
                //res.status(200).json({ success: true, message: "salio ok" });
                res.redirect("/cofiguratiosBolgsProductsEildamais")
                } catch (error) {
                    console.log(" El  blog NO se guardo en la BD",error )
                }
            }else{
                console.log(" El  blog NO se guardo en la BD")
                res.redirect("/cofiguratiosBolgsProductsEildamais")
            }

    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ success: false, message: error });
    }

});

//llega info de Dovemailer para guardar enla BD
router.post('/guardarenlaBD', async (req, res) => {

    // autentificar usuario

    // revisar si llega y que llega
    console.log("que llega esde Dovemaler body", req.body)
    console.log("que llega esde Dovemaler files", req.files)
    console.log("que llega esde Dovemaler params", req.params)

    res.redirect("/")
});

// router.post('/recibiendoDatosdelBlog2', isAuthenticated, async (req, res) => {
//     console.log("000 recibiendoDatosdelBlog que hay en req.body", req.body);

//     const { imagen } = req.files;
//     console.log("como es el archivo de la imagen",imagen)

//     const { titulo, mensaje, tamanoImg } = req.body;
//     // busca la informacion del cliente que quiere emitir un nuevo blog
//     const usuario = await User.findById(req.user.id);
//     //const empresa = usuario ? usuario.empresa : null;
//     const empresa = "mia"

//         if (!imagen) {
//             return res.status(400).send('No se proporcionó ninguna imagen.');
//         }

//         const nombreCarpeta = empresa;
//         const dir = "root@tbsitserver:~/TBSCloud/images#"; // Ajusta la ruta según tu configuración
//         const direccion = "191.101.0.204";
//         const password = "Seba@hostinger22";
//         const direccioCarpeta = "~/TBSCloud/images";

//     // anda perfecto
    
//     try {
//         // conecta y crea la carpeta de la empresa
//         const conn = new Client();
//         await new Promise((resolve, reject) => {
//             conn.on('ready', () => {
//                 conn.exec(`mkdir -p ${direccioCarpeta}/${nombreCarpeta}`, (err, stream) => {
//                     if (err) reject(err);
//                     stream.on('close', (code, signal) => {
//                         conn.end();
//                     })
//                 });
//             }).connect({
//                 host: direccion,
//                 port: 22, // puerto SSH
//                 username: 'root', // Reemplaza con tu usuario SSH
//                 password: password,
//             });
//         });
    
//     } catch (err) {
//         console.error('Error al crear la carpeta:', err);
//         throw err;
//     }
    

    
//     //funcion para guardar los datos en la BD
//     try {
//         const pathImg = rutaCompleta; // Asegúrate de que esta variable esté definida en el alcance adecuado
//         const idCliente = req.user.id;
//         const newBlog = new Blogs({ titulo, mensaje, pathImg, idCliente, rutaSimple, rutaSimple2, tamanoImg });
//         const idBlog = newBlog.id;
//         await newBlog.save();
//         console.log(" el  blog se cargo exitosamente");

//         const usuarioActualizado = await User.findByIdAndUpdate(
//             idCliente,
//             { $push: { Blogs: idBlog } },
//             { new: true }
//         );
//         console.log(" el  usuarioActualizado se cargo exitosamente", usuarioActualizado);

//         res.redirect("/cofiguratiosBolgsProductsEildamais");
//     } catch (error) {
//         console.log(" el  blog NO se cargo exitosamente en la BD", error);
//     }
// });





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
        const formData = req.body;
        console.log("llega la petición", formData);

        if (formData ===  '147852369' ) {
            console.log("NO paso el filtro de seguridad");
            return res.status(400).json({ success: false, message: 'Invalid formData' });
        }

        const dataBlogs = await Blogs.find({ email: "sebastianpaysse@gmail.com" }).sort({ date: -1 });

        res.status(200).json({ success: true, data: dataBlogs });
    } catch (error) {
        console.error('Error handling the request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;



