//requerimientos
const express        = require('express');
const cors           = require('cors')
const path           = require('path');
const exphbs         = require('express-handlebars');
const methodOverride = require('method-override');
const session        = require('express-session');
const flash          = require('connect-flash');
const passport       = require('passport');
const http           = require('http');
const socketIO       = require('socket.io');
const Handlebars     = require('handlebars');
const dotEnv         = require("dotenv").config();
const fileUpload     = require('express-fileupload');


// parche de handlebars
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
// busca la base de datos local

//inicializations
const app = express();
require('dotenv').config();
require('./database');
require('./config/passport');
const server = http.Server(app);
const io = socketIO(server);




//Settings 
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'index',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    publicDir: path.join(app.get('views'), 'public'),
    extname: '.hbs'
}));
app.set('view engine', 'hbs');


//Middlewares
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
const MemoryStore = require('memorystore')(session)
app.use(session({
    secret: 'aniseba22',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }
}));

//app.use(store.initialize())

// sockets
require('./sockets')(io);

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error     = req.flash('error');
    res.locals.errors    = req.flash('errors');
    res.locals.user      = req.user || null;
    next();
});


//Routes
app.use(require('./routes/indexRoutes'));
app.use(require('./routes/users'));
app.use(require('./routes/RRHH'));

//Statics Files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'layouts')));
app.use(express.static(path.join(__dirname, 'partials')));
//app.use(express.static(path.join(__dirname, 'partials/cotiStaffing')));

// app 4004
// app.use((req, res, next) => {
// //    res.status(404).send('404 Not Found');
// //    res.status(404).render('/')
//     res.status(404).redirect('/error404')
// });

//server
const port = process.env.PORT || 3009;
server.listen(port, (err) => {
    console.log(`The Best Staff en desarrollo desde el Servidor con el puerto, ${port}`);
    if (err) {
        return console.log('Error occurs', err);
    }
});