const mongoose = require('mongoose');

//mongoose.set('useFindAndModify', false);

// mongoose.connect('mongodb://localhost/tbs',{
// //         useCreateIndex:true,
// //         useNewUrlParser:true,
// //         useUnifiedTopology:true,
// // //        useFindAndModify:false
// })

// .then(db => console.log('DB esta correctamente conectada'))
// .catch(err => console.error(err));


//Conexion al ambiente de produccion

const dbConnecton = async()=>{
try {
    await mongoose.connect('mongodb+srv://tbsit22:gfF0GBgvD7o5VIV0@tbsit.klyncbu.mongodb.net/tbsit', {
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true,
//        useFindAndModify:false
    })
        .then(db => console.log(`DB is connected`))
        .catch(err => console.error(err));
        
} catch (error) {
    console.log('No se conecto la BD', error);
    throw new Error('Error en la conexion de la base de datos');
};


};

dbConnecton()
