const clienteRepository = require("./cliente.repository");
const {
    validarTextoRequerido,
    validarCorreo,
    validarTelefono
} = require("../../utils/validation");

async function obtenerTodos() {
    return await clienteRepository.obtenerTodos();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    return await clienteRepository.obtenerPorId(id);
}

async function crear(datos) {
    validarTextoRequerido(datos.nombre, "nombre");
    validarTextoRequerido(datos.apellido, "apellido");
    validarCorreo(datos.correo);
    validarTelefono(datos.telefono1);

    const nuevoCliente = {
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        telefono1: datos.telefono1 || null,
        telefono2: datos.telefono2 || null,
        correo: datos.correo || null,
        direccion: datos.direccion || null
    };

    const idCreado = await clienteRepository.crear(nuevoCliente);

    return await clienteRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const clienteExistente = await clienteRepository.obtenerPorId(id);

    if (!clienteExistente) {
        return null;
    }

    const clienteActualizado = {
        nombre: datos.nombre ?? clienteExistente.nombre,
        apellido: datos.apellido ?? clienteExistente.apellido,
        telefono1: datos.telefono1 ?? clienteExistente.telefono1,
        telefono2: datos.telefono2 ?? clienteExistente.telefono2,
        correo: datos.correo ?? clienteExistente.correo,
        direccion: datos.direccion ?? clienteExistente.direccion
    };

    validarTextoRequerido(clienteActualizado.nombre, "nombre");
    validarTextoRequerido(clienteActualizado.apellido, "apellido");
    validarCorreo(clienteActualizado.correo);
    validarTelefono(clienteActualizado.telefono1);

    await clienteRepository.actualizar(id, clienteActualizado);

    return await clienteRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const clienteExistente = await clienteRepository.obtenerPorId(id);

    if (!clienteExistente) {
        return null;
    }

    await clienteRepository.eliminar(id);

    return clienteExistente;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
