//
// Modulos
//
const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//
// Inicializaciones
//
const app = express();
require('./lib/passport');

//
// Ajustes
//

// El puerto se establecerá en el indicado por el sistema, sino, entonces tomará el puerto 3000
app.set('port', process.env.PORT || 3000);

// Se configura el motor de plantillas  
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//
// Funciones
//

// Alertas
app.use(session({
    secret: 'proyecto2-crud-session',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

// Se registran las peticiones que llegan antes de procesarlas
app.use(morgan('dev'));

// Funciones para aceptar desde los formularios los datos enviados
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

//
// Variables globales
//
app.use(function (req, res, next) {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})


//
// Rutas
//
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/cubes', require('./routes/cubes'));

//
// Archivos públicos
//
app.use(express.static(path.join(__dirname, 'public')));


//
// Inicio del servidor
//
app.listen(app.get('port'), function () {
    console.log('Servidor ejecutandose en el puerto ', app.get('port'));
})