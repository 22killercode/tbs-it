// SERVIDOR DE SOCKETS
// base de datos
const usuario    = require('./models/User');
//const carteraCli = require('./models/carteraDClientes');

module.exports = io => {
  io.on('connection', async socket => {
      console.log(' activo los sockets desde el server', socket.id);
  
     // SOCKETS PARA LA UBICASION GEOGRAFICA DE LA DIRECCION

    //REVERSE GEOCODE aqui se recive la direccion a partir de coordenadas primera direccion
    socket.on('userCoordinates', (coords) => {
      const lat = coords.lat
      const lng = coords.lng
      //aqui se ponen las coordenadas para obtener la direccion
      geocoder.geocode(lat + ',' + lng, async (err, res) => {
        //aqui se obtiene la direccion y se envia a la vista index
        const country  = res[0].country;
        const city     = res[0].city;
        const state    = res[0].state;
        const cp       = res[0].zipcode;
        const calle    = res[0].streetName;
        const numCalle = res[0].streetNumber;
        const lat      = res[0].latitude;
        const long     = res[0].longitude;
        //se pasa al objeto adress1 para enviar a la vista       
        const adress1  = { country, city, state, cp, calle, numCalle, lat, long }
        socket.emit('newdireccion', adress1);
      });
    });

    //FORWARD GEOCODER ENVIA LOS DATOS DE LA DIRECCION A CAMBIAR PARA QUE LA BUSQUE Y ME LA MUESTRE CON UN MAPA Y procees to get lat + lng
    socket.on('nuevoBuqueda', (newAdress) => {
      console.log('que hay en adress', newAdress)
      const adress = [newAdress.dire, newAdress.localidad];
      const country2 = newAdress.pais;
      geocoder.geocode(adress + ',' + country2, async (err, res) => {
        const lati = res[0].latitude;
        const longi = res[0].longitude;
        const country = res[0].country;
        const city = res[0].city;
        const state = res[0].state;
        const cp = res[0].zipcode;
        const calle = res[0].streetName;
        const numCalle = res[0].streetNumber;
        const newSearch = { lati, longi, country, city, state, cp, calle, numCalle };
        console.log('que hay en adress', newAdress, newSearch)
        socket.emit('newSearch', newSearch);
      });
    });

    /*****************************guardar en BD GEODATAS****************************/
    socket.on('saveData1', (coords, seftyCode1) => {
      const idUser = seftyCode1
      console.log('desde socket.on', coords, seftyCode1, idUser)
      const lat = coords.lat
      const lng = coords.lng
      //aqui se ponen las coordenadas para obtener la direccion
      geocoder.geocode(lat + ',' + lng, async (err, res) => {
        //aqui se obtiene la direccion y se envia a la vista index
        const country = res[0].country;
        const city = res[0].city;
        const state = res[0].state;
        const cp = res[0].zipcode;
        const calle = res[0].streetName;
        const numCalle = res[0].streetNumber;
        const lat = res[0].latitude;
        const long = res[0].longitude;
        // guarda en usuario
        const etapa2 = null;
        const etapa3Geo = 'etapa3Geo'
        const tipoInscripcion = "Usuario"
        const culos = await usuario.findOneAndUpdate({ _id: idUser }, { tipoInscripcion, lat, long, country, city, state, cp, calle, numCalle, etapa3Geo, etapa2 });
      });
    });

    socket.on('saveData2', async (newSearch, seftyCode0101) => {
      const idUser = seftyCode0101
      const lat = newSearch.lati;
      const long = newSearch.longi;
      const country = newSearch.country;
      const city = newSearch.city;
      const state = newSearch.state;
      const cp = newSearch.cp;
      const calle = newSearch.calle;
      const numCalle = newSearch.numCalle;
      const sebastian = 'paysse';
      // guarda en usuario
      const etapa2 = null;
      const etapa3Geo = 'etapa3Geo'
      const tipoInscripcion = "Usuario"
      const culos = await usuario.findOneAndUpdate({ _id: idUser }, { tipoInscripcion, lat, long, country, city, state, cp, calle, numCalle, etapa3Geo, etapa2 });
      console.log('que llega?', newSearch)

    });

    // *************************SOCKET PARA LOS CHATS DE TBS*************************
    // nos idica cuando el server se desconecta o conecta y tambien el socket del chat y actualiza su estado de online a offline
    socket.on('disconnect', async () => {
      console.log('El server se apago y cambia e tado de onLine a FALSE',socket.id)
    });

    socket.on('connect', async () => {
      console.log('cliente Conectado desde el server se encendio y cambia e tado de onLine a TRUE',socket.id)
    });

    // envia todos los datos de todos los usuario que entro por el Chat y la cantidad
    socket.on('entroUsuario', async (data) => {
      // Arma los datos para guardarla en la BD de los usuarios ingresados
      //console.log('eNTRO UN USUARO NUEVO',data)
      const mailaso     = data.email1
      const socketId    = data.socketId
      const onLine   = true
      const cheq = await chatConect.findOneAndUpdate({mail:mailaso}, {onLine}, {new:true});
      //console.log('Llega desde clientSocket fronend la info de queun cliente se logeo y entro a TBS',socketId,cheq)
      // socket.emit('infoBotonChat');
    });
    //cuando escucha desde el frontend que alguien salio de la pagina pasa a offLine
    socket.on('desconectado', async (socketId) => {
      const onLine = false
      const cheq = await chatConect.findOneAndUpdate({socketId:socketId}, {onLine}, {new:true});
      console.log('cliente desconectado cambio el estado a offline',socketId,cheq)
    });
    //cuando escucha desde el frontend que alguien ENTRO de la pagina pasa a onLine
    socket.on('conectado', async (socketId) => {
      const onLine = true
      const cheq = await chatConect.findOneAndUpdate({socketId:socketId}, {onLine}, {new:true});
      console.log('cliente se conecto cambio el estado a online',socketId,cheq)
    });
    //Escucha la emision del mensaje del chat que viene del frontend de cenversacionChat
    socket.on('MensajeChat', async (dataChat22) => {
      const {mailFrom, mailTo, email, socketID, mensaje} = dataChat22
      // console.log('Que llega al backend de dataChat',dataChat22);
      const from          = mailFrom
      const to            = mailTo
      const dataUser      = await usuario.findOne({email:from});
      const fecha1        = new Date().getHours()
      const fecha2        = new Date().getMinutes()
      const fecha         = (fecha1 + ':' + fecha2)
      const fechaCompleta = calFecha()
      const pathFoto      = dataUser.pathPhoto
      const mensajeChat   = mensaje
      const mensajeNuevo  = true
      const data1         = {mensaje,mensajeNuevo, socketID, pathFoto, email, fecha,fechaCompleta,from,to};
      const cheq          = await chatConect.findOneAndUpdate({mail:from}, {socketID}, {new:true});
      const dataSocketID  = await chatConect.findOne({mail:to});
      const para          = dataSocketID.socketID
      // const reGrabo = await chatConect.findOneAndUpdate({idEmpleado}, {onLine}, {new:true})
      // guardar los mensajes
      const guardarChat = await new chatMess({fechaCompleta,mensajeNuevo,mensajeChat,fecha,pathFoto,email,from,to});
      guardarChat.save();
      // emitir el mensaje a mi mismo
      socket.emit('chatSaliente1', data1);
      // emite el mensaje a todos
      // socket.broadcast.emit('chatEntrante',data1);
      // busca si estas en el chat con la persona o no
      const elChateaCon = cheq.chateoCon
      const elChateaCon2= dataSocketID.chateoCon
      // averiguo si el chatea conmigo antes de enviar el mensaje
      if (elChateaCon == to && elChateaCon2 == from) {
        socket.broadcast.to(para).emit('chatEntrante', data1);
      } else {
        socket.broadcast.to(para).emit('mensajeEntrante', data1);
      };
      // console.log('llega del mensaje del chat al backend lo procesa y emita a chatSaliente',elChateaCon, elChateaCon2 )
    });
    
    // para crear grupo o sala de trabajo verifica que no repitas el mismo integrante
    socket.on('crearSala', async (dataSala) => {    
    //  console.log('que llega a crear sala',dataSala)  
      const { socketID, nombreSala, integrante, creadorGrupo} = dataSala 
      // revisar que no dulpique el mismo contacto y avisar
      //console.log('que hay en guardarGrupo',guardarGrupo);
      const culo = await grupoChat.find({socketID:socketID})
     // console.log('los datos que enconramos en la BD de los integrantes',culo);
      if(culo.length >= 1){
     //   console.log('entro al for hay mas de un cliente cargado para armar el grupo')
        const idG = []
        for (const a1 of culo) {
          const integra = a1.integrante
          const idGrupo = a1.idGrupo
          idG.push(idGrupo)
          if (integra == integrante) {
            // ya cargaste este integrante
            console.log('ya cargaste este integrante')
            const intDupli = {socketID,nombreSala,integrante}
            socket.emit('integranteDuplicado', intDupli);
            return
          }
        };
        // sino esta duplicado guardar sala en BD
          const idGrupo = idG[0]
         // console.log('que hay en idGrupo',idGrupo)
          // busca si ya tiene id unico del grupo
            const guardarGrupo = await new grupoChat({socketID,creadorGrupo, nombreSala, integrante,idGrupo});
            guardarGrupo.save()
            // enviar al frontend el cliente cargado
            const dataSala1 = dataSala
            if(culo.length == 1){
              socket.emit('creandoSalaConBoton', dataSala1);
              return
            }else{
              socket.emit('creandoSala', dataSala1);
              return
            }
      }
      else{
          // no tiene id unico del grupo crea el primer integrante del grupo con id unico
          const idGrupo      = shortid.generate();
          const guardarGrupo = await new grupoChat({socketID,creadorGrupo, nombreSala, integrante,idGrupo});
          guardarGrupo.save();
          // enviar al frontend el cliente cargado
          const dataSala1 = dataSala
          socket.emit('creandoSala', dataSala1);
          return
      }

    });

    socket.on('armarSala', async (armarSala) =>{
      //console.log('llega a armar sala', armarSala)
      const socID = armarSala.socketID
      const grupo = await grupoChat.find({socketID:socID});
      //console.log('Que hay en grupo desde el backend??', grupo)
      if (grupo.length >= 1) {
      //  console.log('Crear el grupo', grupo)
        // aqui se arma el grupo en la BD
        const grupoCreado   = true
        const miembrosGrupo = []
        const socketID      = grupo[0].socketID
        const nombreSala    = grupo[0].nombreSala
        const idGrupoBorrar = grupo[0].idGrupo
        const idGrupo       = shortid.generate();
        const creadorGrupo  = grupo[0].creadorGrupo
        const G = await usuario.findById(creadorGrupo);
        const mailCreador = G.email
        for (const a1 of grupo) {
          const integrante  = a1.integrante
          miembrosGrupo.push({integrante});
        };
        const crearGrupo    = await new grupoChat({socketID, nombreSala, miembrosGrupo,idGrupo, grupoCreado, creadorGrupo, mailCreador });
        crearGrupo.save()
        // debe borrar los integrantes individuales del grupo
        console.log('que hay en crearGrupo desde socket backend',crearGrupo)
        for (const a2 of grupo) {
          await grupoChat.findOneAndDelete({idGrupo:idGrupoBorrar});
        }
        // luego renderiza la pagina del chat grupal
        socket.emit('cerrarCrearGrupo');
        return
      } else {
        socket.emit('agrega2Integrantes');
        return
      };
      
    });




  });
};
