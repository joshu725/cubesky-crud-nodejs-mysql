const bcrypt = require('bcryptjs');

const helpers = {};

// Función para encriptar la contraseña mediante el modulo bcryptjs
helpers.encryptPassword = async function (pass) {
    // Cantidad de veces generando la contraseña encriptada, entre mas mejor, pero también será mas lento
    const salt = await bcrypt.genSalt(10);
    const finalPass = await bcrypt.hash(pass, salt);
    return finalPass;
};

helpers.comparePassword = async function (pass, savedPass) {
    try {
        return await bcrypt.compare(pass, savedPass);
    } catch (e) {
        console.log(e);
    }
};

module.exports = helpers;