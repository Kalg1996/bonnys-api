const servicioRepository = require("./servicio.repository");

async function obtenerTodos() {
    return await servicioRepository.obtenerTodos();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    return await servicioRepository.obtenerPorId(id);
}

async function crear(datos) {
    console.log(datos);
    if (
        !datos.nombre ||
        datos.precio === undefined ||
        datos.duracion_minutos === undefined
    ) {
        return null;
    }

    const nuevoServicio = {
        nombre: datos.nombre,
        descripcion: datos.descripcion || null,
        precio: datos.precio,
        duracion_minutos: datos.duracion_minutos,
        estado: datos.estado ?? true,
        url_foto: datos.url_foto || null,
        url_video: datos.url_video || null
    };

    const idCreado = await servicioRepository.crear(nuevoServicio);

    return await servicioRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const servicioExistente = await servicioRepository.obtenerPorId(id);

    if (!servicioExistente) {
        return null;
    }

    const servicioActualizado = {
        nombre: datos.nombre || servicioExistente.nombre,
        descripcion: datos.descripcion ?? servicioExistente.descripcion,
        precio: datos.precio ?? servicioExistente.precio,
        duracion_minutos:
            datos.duracion_minutos ?? servicioExistente.duracion_minutos,
        estado: datos.estado ?? servicioExistente.estado,
        url_foto: datos.url_foto ?? servicioExistente.url_foto,
        url_video: datos.url_video ?? servicioExistente.url_video
    };

    await servicioRepository.actualizar(id, servicioActualizado);

    return await servicioRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const servicioExistente = await servicioRepository.obtenerPorId(id);

    if (!servicioExistente) {
        return null;
    }

    await servicioRepository.eliminar(id);

    return servicioExistente;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};