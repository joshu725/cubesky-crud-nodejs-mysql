const express = require('express');
const router = express.Router();

// db
const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

// Cuando el navegador trate de hacer una petición get
router.get('/add', isLoggedIn, function(req, res){
    res.render('cubes/add');
})

router.post('/add', isLoggedIn, async function (req, res) {
    // Se guardan los datos recibidos en una variable para después tratar con el usuario, ademas se muestra en consola
    const { nombre, marca, forma, nivel, descripcion } = req.body;
    const newCube = {
        nombre,
        marca,
        forma,
        nivel,
        descripcion,
        usuario_id: req.user.id
    };
    console.log(newCube);

    await pool.query('insert into cubos set ?', [newCube]);

    // Mensaje en pantalla
    req.flash('success', 'El cubo se ha guardado correctamente!');

    res.redirect('/cubes');
})

router.get('/', isLoggedIn, async function (req, res) {
    const cubes = await pool.query('select * from cubos');
    res.render('cubes/list', { cubes });
})

router.get('/delete/:id', isLoggedIn, async function (req, res) {
    const { id } = req.params;
    await pool.query('delete from cubos where id = ?', [id]);
    // Mensaje en pantalla
    req.flash('success', 'El cubo se ha eliminado correctamente!');
    res.redirect('/cubes');
});

router.get('/edit/:id', isLoggedIn, async function (req, res) {
    const { id } = req.params;
    const cubes = await pool.query('select * from cubos where id = ?', [id]);
    res.render('cubes/edit', {cube: cubes[0]});
});

router.post('/edit/:id', isLoggedIn, async function (req, res) {
    const { id } = req.params;
    const { nombre, marca, forma, nivel, descripcion } = req.body;
    const newCube = {
        nombre,
        marca,
        forma,
        nivel,
        descripcion
    };
    await pool.query('update cubos set ? where id = ?', [newCube, id]);
    // Mensaje en pantalla
    req.flash('success', 'El cubo se ha editado correctamente!');
    res.redirect('/cubes');
});

module.exports = router;