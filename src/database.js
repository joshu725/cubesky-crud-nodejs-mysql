const mysql2 = require('mysql2');
const { promisify } = require('util');

//
// Migraciones
//

// Conectarse a la base de datos
const connection = mysql2.createConnection({
    //
    // DATOS A CAMBIAR DEPENDIENDO EL ENTORNO DE EJECUCIÓN
    //
    host: 'localhost',
    user: 'root',
    password: '123456' // Se deberá cambiar a la contraseña de MySQL puesta en su instalación
    //
    // DATOS A CAMBIAR DEPENDIENDO EL ENTORNO DE EJECUCIÓN
    //
});

// Se crea la base de datos en caso de no existir
connection.query('create database if not exists db_cubos', function (err) {
    if (err) {
        console.error(err);
    }
});

 // Se conecta a la base de datos
 connection.query('use db_cubos', function (err) {
    if (err) {
        console.error(err);
    }
 });

// Se crea una una tabla en la base de datos en caso de no existir
connection.query(`
    create table if not exists usuarios(
    id int(11) primary key auto_increment,
    usuario varchar(24) not null,
    pass varchar(80) not null)
    `, function (err) {
        if (err) {
            console.error(err);
        }
});
// Se crea una una tabla en la base de datos en caso de no existir
connection.query(`
    create table if not exists cubos(
    id int(11) primary key auto_increment,
    nombre varchar(60) not null,
    marca varchar(30) not null,
    forma varchar(30) not null,
    nivel varchar(20) not null,
    descripcion text,
    usuario_id int(11),
    fecha_creacion timestamp not null default current_timestamp,
    constraint fk_usuario foreign key (usuario_id) references usuarios(id))
    `, function (err) {
        if (err) {
            console.error(err);
        }
});

// Cerrar la conexión a la base de datos
connection.end();

//
// Conexión mediante pool
//

// Conexión normal mediante pool a la base de datos
const pool = mysql2.createPool({
    //
    // DATOS A CAMBIAR DEPENDIENDO EL ENTORNO DE EJECUCIÓN
    //
    host: 'localhost',
    user: 'root',
    password: '123456', // Se deberá cambiar a la contraseña de MySQL puesta en su instalación
    database: 'db_cubos'
    //
    // DATOS A CAMBIAR DEPENDIENDO EL ENTORNO DE EJECUCIÓN
    //
});

// Conexión a la base de datos
pool.getConnection(function (err, connection) {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Error - La base de datos ha sido desconectada')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Error - La base de datos tiene muchas conexiones')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Error - La conexión a la base de datos fue rechazada')
        }
    }

    if (connection) connection.release();
    console.log('La base de datos está conectada :)');
    return;
});

// Se convierten los callbacks en promesas que son soportadas para querys
pool.query = promisify(pool.query);

module.exports = pool;