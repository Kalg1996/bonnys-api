const servicioRepository = require("./servicio.repository");
const {
    validarTextoRequerido,
    validarNumeroMinimo
} = require("../../utils/validation");

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
    validarTextoRequerido(datos.nombre, "nombre");
    validarNumeroMinimo(datos.precio, "precio", 0);
    validarNumeroMinimo(datos.duracion_minutos, "duracion_minutos", 1);

    const nuevoServicio = {
        nombre: datos.nombre.trim(),
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
        nombre: datos.nombre ?? servicioExistente.nombre,
        descripcion: datos.descripcion ?? servicioExistente.descripcion,
        precio: datos.precio ?? servicioExistente.precio,
        duracion_minutos:
            datos.duracion_minutos ?? servicioExistente.duracion_minutos,
        estado: datos.estado ?? servicioExistente.estado,
        url_foto: datos.url_foto ?? servicioExistente.url_foto,
        url_video: datos.url_video ?? servicioExistente.url_video
    };

    validarTextoRequerido(servicioActualizado.nombre, "nombre");
    validarNumeroMinimo(servicioActualizado.precio, "precio", 0);
    validarNumeroMinimo(servicioActualizado.duracion_minutos, "duracion_minutos", 1);

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
