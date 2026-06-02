const promocionRepository = require("./promocion.repository");
const {
    crearErrorValidacion,
    validarNumeroMinimo,
    validarTextoRequerido
} = require("../../utils/validation");

function validarFechas(fechaInicio, fechaFin) {
    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
        throw crearErrorValidacion("fecha_fin debe ser mayor o igual a fecha_inicio");
    }
}

function normalizar(datos, existente = {}) {
    const promocion = {
        titulo: datos.titulo ?? existente.titulo,
        descripcion: datos.descripcion ?? existente.descripcion ?? null,
        precio_original: datos.precio_original ?? existente.precio_original ?? null,
        precio_promocion: datos.precio_promocion ?? existente.precio_promocion ?? null,
        url_imagen: datos.url_imagen ?? existente.url_imagen ?? null,
        fecha_inicio: datos.fecha_inicio ?? existente.fecha_inicio ?? null,
        fecha_fin: datos.fecha_fin ?? existente.fecha_fin ?? null,
        estado: datos.estado ?? existente.estado ?? true
    };

    validarTextoRequerido(promocion.titulo, "titulo");

    if (promocion.precio_original !== null && promocion.precio_original !== "") {
        validarNumeroMinimo(promocion.precio_original, "precio_original", 0);
    }

    if (promocion.precio_promocion !== null && promocion.precio_promocion !== "") {
        validarNumeroMinimo(promocion.precio_promocion, "precio_promocion", 0);
    }

    validarFechas(promocion.fecha_inicio, promocion.fecha_fin);

    return {
        ...promocion,
        titulo: promocion.titulo.trim(),
        precio_original:
            promocion.precio_original === "" ? null : promocion.precio_original,
        precio_promocion:
            promocion.precio_promocion === "" ? null : promocion.precio_promocion,
        fecha_inicio: promocion.fecha_inicio || null,
        fecha_fin: promocion.fecha_fin || null,
        estado: Boolean(promocion.estado)
    };
}

async function obtenerTodos() {
    return await promocionRepository.obtenerTodos();
}

async function obtenerPublicas() {
    return await promocionRepository.obtenerPublicas();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) return null;

    return await promocionRepository.obtenerPorId(id);
}

async function crear(datos) {
    const promocion = normalizar(datos);
    const idCreado = await promocionRepository.crear(promocion);

    return await promocionRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) return null;

    const existente = await promocionRepository.obtenerPorId(id);

    if (!existente) return null;

    const promocion = normalizar(datos, existente);
    await promocionRepository.actualizar(id, promocion);

    return await promocionRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) return null;

    const existente = await promocionRepository.obtenerPorId(id);

    if (!existente) return null;

    await promocionRepository.eliminar(id);

    return existente;
}

module.exports = {
    obtenerTodos,
    obtenerPublicas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
