const mongoose = require('mongoose');

// mongoose.set('useFindAndModify', false);

// mongoose.connect('mongodb://localhost/tbs',{
//     // useCreateIndex:true,
//     // useNewUrlParser:true,
//     // useUnifiedTopology:true,
// })

// .then(db => console.log('DB esta correctamente conectada'))
// .catch(err => console.error(err));


// //Conexion al ambiente de produccion

const dbConnecton = async()=>{
try {
    await mongoose.connect('mongodb+srv://TBS-ITpaysse22:TBS-ITpaysse221409cluster0.0hjhjyw.mongodb.net/', {
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    })
        .then(db => console.log(`DB is connected`))
        .catch(err => console.error(err));
        
} catch (error) {
    console.log('No se conecto la BD', error);
    throw new Error('Error en la conexion de la base de datos');
};


};

dbConnecton()