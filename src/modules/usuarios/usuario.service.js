const usuarioRepository = require("./usuario.repository");

async function obtenerTodos() {
    return await usuarioRepository.obtenerTodos();
}

async function obtenerPorId(id) {
    if(isNaN(id) || id <= 0) {
        return null;
    }
    return await usuarioRepository.obtenerPorId(id);
}

async function crear(datos) {
    if (!datos.nombre || !datos.apellido || !datos.nombre_usuario || !datos.password || !datos.rol) {
        return null;
    }
    const nuevoUsuario = {
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono1: datos.telefono1 || null,
        telefono2: datos.telefono2 || null,
        correo: datos.correo || null,
        nombre_usuario: datos.nombre_usuario,
        password: datos.password,
        rol: datos.rol,
        estado: datos.estado ?? true,
        url_foto: datos.url_foto || null
    };
    const idCreado = await usuarioRepository.crear(nuevoUsuario);

    return await usuarioRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const usuarioExistente = await usuarioRepository.obtenerPorId(id);

    if (!usuarioExistente) {
        return null;
    }

    const usuarioActualizado = {
        nombre: datos.nombre || usuarioExistente.nombre,
        apellido: datos.apellido || usuarioExistente.apellido,
        telefono1: datos.telefono1 ?? usuarioExistente.telefono1,
        telefono2: datos.telefono2 ?? usuarioExistente.telefono2,
        correo: datos.correo ?? usuarioExistente.correo,
        nombre_usuario: datos.nombre_usuario || usuarioExistente.nombre_usuario,
        rol: datos.rol || usuarioExistente.rol,
        estado: datos.estado ?? usuarioExistente.estado,
        url_foto: datos.url_foto ?? usuarioExistente.url_foto
    };

    await usuarioRepository.actualizar(id, usuarioActualizado);

    return await usuarioRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const usuarioExistente = await usuarioRepository.obtenerPorId(id);

    if (!usuarioExistente) {
        return null;
    }

    await usuarioRepository.eliminar(id);

    return usuarioExistente;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};