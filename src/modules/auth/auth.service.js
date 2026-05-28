const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioRepository = require("../usuarios/usuario.repository");

async function login(nombre_usuario, password) {
    if (!nombre_usuario || !password) {
        return null;
    }

    const usuario = await usuarioRepository.obtenerPorNombreUsuario(nombre_usuario);

    if (!usuario) {
        return null;
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
        return null;
    }

    const payload = {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });

    return {
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.rol,
            estado: usuario.estado
        }
    };
}

module.exports = {
    login
};