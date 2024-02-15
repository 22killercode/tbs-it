require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

//models
const User = require('../models/User');
const Blogs = require('../models/blogs');
// helpers
const helpers = require('../helpers/auth');
const { isAuthenticated } = require('../helpers/auth');

const bodyParser = require('body-parser');
router.use(bodyParser.text());


// para armar NUEVOS blogs
router.post('/recibiendoDatosdelBlog', isAuthenticated, async (req, res) => {
    //console.log("000 que hay en req.body", req.body);
    // revisar que llega toda la info dle frontend
    //console.log("00 que empresa encontro", req.files);
    const { imagen } = req.files;
    const {titulo, mensaje} = req.body

    try {
        // busca la informacion del cliente que quiere emitir un nuevo blog
        const usuario = await User.findById(req.user.id);
        const empresa = usuario ? usuario.empresa : null;
        const cheqCantidadBlogs = usuario.Blogs.length
        if (cheqCantidadBlogs >= 10) {
            req.flash('error', 'Ya tienes 10 o mas blogs cargados edita o elimina algunos');
            //res.redirect("/cofiguratiosBolgsProductsEildamais")
        }

        //console.log("0 que empresa encontro", empresa);

        // Función para crear una carpeta
        const crearCarpeta = (nombreCarpeta) => {
            // Verificar si la carpeta ya existe
            if (!fs.existsSync(nombreCarpeta)) {
                // Crear la carpeta
                const createCarpeta = path.join(__dirname, `../uploads/${nombreCarpeta}`);
                //console.log("que path es? ", createCarpeta)
                fs.mkdirSync(createCarpeta, { recursive: true });
                console.log('Carpeta creada exitosamente.');
            } else {
                console.log('La carpeta ya existe.');
            }
        };
        const nombreCarpeta = empresa;
        crearCarpeta(nombreCarpeta);

        // mover imagen a la carpeta
        const rutaCompleta = path.join(__dirname, `../uploads/${nombreCarpeta}/${imagen.name}`);
        const rutaSimple = `/${nombreCarpeta}/${imagen.name}`;

        // mueve la foto a la carpeta
        imagen.mv(rutaCompleta, async function(err){
            if (err){
                console.log('hay un error en la subida de la imagen a la carpeta',err);
            }
            else {
            console.log("la carpeta ha sido creada exitosamente")
            }
        });

        try {
            // guardar info en la BD
            const pathImg = rutaCompleta
            const idCliente = req.user.id
            const newBlog = new Blogs({titulo, mensaje, pathImg, idCliente, rutaSimple});
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

        } catch (error) {
            console.log(" el  blog NO se cargo exitosamente en la BD", error)
        }
        //res.status(200).json({ success: true, message: "salio ok" });
        res.redirect("/cofiguratiosBolgsProductsEildamais")

    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ success: false, message: error });
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
            await Blogs.findByIdAndUpdate(req.params.id, {pathImg, rutaSimple});
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



