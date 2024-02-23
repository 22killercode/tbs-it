//requerimientos
const express        = require('express');
const cors           = require('cors')
const path           = require('path');
const exphbs         = require('express-handlebars');
const methodOverride = require('method-override');
const flash          = require('connect-flash');
const http           = require('http');
const Handlebars     = require('handlebars');
const fileUpload     = require('express-fileupload');
const favicon        = require('serve-favicon')
const session = require('express-session');


// parche de handlebars
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
// busca la base de datos local

//inicializations
const app = express();
require('./database');
const server = http.Server(app);

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


// Configurar express-session
app.use(session({
    secret: 'tu_secreto_aqui', // Cambia esto con una cadena secreta más segura
    resave: true,
    saveUninitialized: true
  }));
  
  // Configurar connect-flash
  app.use(flash());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 }
}));


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
app.use(require('./routes/consuSitiosWeb'));
app.use(require('./routes/blogs'));



//Statics Files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'layouts')));
app.use(express.static(path.join(__dirname, 'partials')));
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('C:\\Users\\Coderian\\Desktop\\pruebaTBS\\src\\uploads'));



app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//server
const port = process.env.PORT || 3019;
server.listen(port, (err) => {
    console.log(`The Best Staff en desarrollo desde el Servidor con el puerto, ${port}`);
    if (err) {
        return console.log('Error occurs', err);
    }
});