const galeriaTrabajoRepository = require("./galeriaTrabajo.repository");
const {
    crearErrorValidacion,
    validarTextoRequerido
} = require("../../utils/validation");

const TIPOS_PERMITIDOS = ["IMAGEN", "VIDEO"];

function normalizar(datos, existente = {}) {
    const trabajo = {
        titulo: datos.titulo ?? existente.titulo ?? null,
        descripcion: datos.descripcion ?? existente.descripcion ?? null,
        tipo: datos.tipo ?? existente.tipo,
        url_media: datos.url_media ?? existente.url_media,
        destacado: datos.destacado ?? existente.destacado ?? false,
        estado: datos.estado ?? existente.estado ?? true
    };

    if (!TIPOS_PERMITIDOS.includes(trabajo.tipo)) {
        throw crearErrorValidacion("tipo solo puede ser IMAGEN o VIDEO");
    }

    validarTextoRequerido(trabajo.url_media, "url_media");

    return {
        ...trabajo,
        titulo: trabajo.titulo || null,
        descripcion: trabajo.descripcion || null,
        destacado: Boolean(trabajo.destacado),
        estado: Boolean(trabajo.estado)
    };
}

async function obtenerTodos() {
    return await galeriaTrabajoRepository.obtenerTodos();
}

async function obtenerPublicos() {
    return await galeriaTrabajoRepository.obtenerPublicos();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) return null;

    return await galeriaTrabajoRepository.obtenerPorId(id);
}

async function crear(datos) {
    const trabajo = normalizar(datos);
    const idCreado = await galeriaTrabajoRepository.crear(trabajo);

    return await galeriaTrabajoRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) return null;

    const existente = await galeriaTrabajoRepository.obtenerPorId(id);

    if (!existente) return null;

    const trabajo = normalizar(datos, existente);
    await galeriaTrabajoRepository.actualizar(id, trabajo);

    return await galeriaTrabajoRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) return null;

    const existente = await galeriaTrabajoRepository.obtenerPorId(id);

    if (!existente) return null;

    await galeriaTrabajoRepository.eliminar(id);

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
