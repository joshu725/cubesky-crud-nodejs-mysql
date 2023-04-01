const passport = require('passport');
const LocalStrategy = require('passport-local');

const pool = require('../database');
const helpers = require('../lib/helpers');

// Inicio de sesión
passport.use('local.signin', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'pass',
    passReqToCallback: true
}, async function (req, usuario, pass, done) {
    console.log(req.body);
    const rows = await pool.query('select * from usuarios where usuario = ?', [usuario]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPass = await helpers.comparePassword(pass, user.pass);
        if (validPass) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.usuario) + ' :)');
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'Usuario no encontrado'));
    }

}));


// Registro
passport.use('local.signup', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'pass',
    passReqToCallback: true
}, async function(req, usuario, pass, done) {
    
    const newUser = {
        usuario: usuario,
        pass: pass
    };

    newUser.pass = await helpers.encryptPassword(pass);

    const result = await pool.query('insert into usuarios set ?', [newUser]);

    newUser.id = result.insertId;
    
    return done(null, newUser);
}));


passport.serializeUser(function (usuario, done) {
    done(null, usuario.id);
});

passport.deserializeUser(async function (id, done) {
    const rows = await pool.query('select * from usuarios where id = ?', [id]);
    done(null, rows[0]);
});