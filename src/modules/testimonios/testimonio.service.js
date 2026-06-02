const testimonioRepository = require("./testimonio.repository");
const {
    crearErrorValidacion,
    validarNumeroMinimo,
    validarTextoRequerido
} = require("../../utils/validation");

function validarBooleano(valor, campo) {
    if (typeof valor !== "boolean") {
        throw crearErrorValidacion(`${campo} debe ser booleano`);
    }
}

function normalizar(datos, existente = {}) {
    const testimonio = {
        nombre_cliente: datos.nombre_cliente ?? existente.nombre_cliente,
        comentario: datos.comentario ?? existente.comentario,
        calificacion: datos.calificacion ?? existente.calificacion,
        url_foto: datos.url_foto ?? existente.url_foto ?? null,
        estado: datos.estado ?? existente.estado ?? true
    };

    validarTextoRequerido(testimonio.nombre_cliente, "nombre_cliente");
    validarTextoRequerido(testimonio.comentario, "comentario");
    validarNumeroMinimo(testimonio.calificacion, "calificacion", 1);

    if (Number(testimonio.calificacion) > 5) {
        throw crearErrorValidacion("calificacion debe ser menor o igual a 5");
    }

    validarBooleano(Boolean(testimonio.estado), "estado");

    return {
        ...testimonio,
        nombre_cliente: testimonio.nombre_cliente.trim(),
        comentario: testimonio.comentario.trim(),
        calificacion: Number(testimonio.calificacion),
        estado: Boolean(testimonio.estado)
    };
}

async function obtenerTodos() {
    return await testimonioRepository.obtenerTodos();
}

async function obtenerPublicos() {
    return await testimonioRepository.obtenerPublicos();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) return null;

    return await testimonioRepository.obtenerPorId(id);
}

async function crear(datos) {
    const testimonio = normalizar(datos);
    const idCreado = await testimonioRepository.crear(testimonio);

    return await testimonioRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) return null;

    const existente = await testimonioRepository.obtenerPorId(id);

    if (!existente) return null;

    const testimonio = normalizar(datos, existente);
    await testimonioRepository.actualizar(id, testimonio);

    return await testimonioRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) return null;

    const existente = await testimonioRepository.obtenerPorId(id);

    if (!existente) return null;

    await testimonioRepository.eliminar(id);

    return existente;
}

module.exports = {
    obtenerTodos,
    obtenerPublicos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
