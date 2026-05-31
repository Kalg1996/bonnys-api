const galeriaRepository = require("./galeria.repository");
const {
    crearErrorValidacion,
    validarTextoRequerido
} = require("../../utils/validation");

const TIPOS_VALIDOS = ["IMAGEN", "VIDEO"];

function validarMedia(media) {
    validarTextoRequerido(media.tipo, "tipo");
    validarTextoRequerido(media.url, "url");

    if (!TIPOS_VALIDOS.includes(media.tipo)) {
        throw crearErrorValidacion("tipo solo puede ser IMAGEN o VIDEO");
    }

    return {
        tipo: media.tipo,
        url: media.url,
        orden: Number.isFinite(Number(media.orden)) ? Number(media.orden) : 0
    };
}

async function obtenerGaleriaServicio(idServicio) {
    const servicio = await galeriaRepository.obtenerServicioPorId(idServicio);

    if (!servicio) {
        throw crearErrorValidacion("Servicio no encontrado");
    }

    return await galeriaRepository.obtenerGaleriaServicio(idServicio);
}

async function obtenerGaleriaProducto(idProducto) {
    const producto = await galeriaRepository.obtenerProductoPorId(idProducto);

    if (!producto) {
        throw crearErrorValidacion("Producto no encontrado");
    }

    return await galeriaRepository.obtenerGaleriaProducto(idProducto);
}

async function agregarMediaServicio(idServicio, media) {
    const servicio = await galeriaRepository.obtenerServicioPorId(idServicio);

    if (!servicio) {
        throw crearErrorValidacion("Servicio no encontrado");
    }

    const datosMedia = validarMedia(media);
    const idMedia = await galeriaRepository.agregarMediaServicio(idServicio, datosMedia);

    return await galeriaRepository.obtenerMediaServicioPorId(idMedia);
}

async function agregarMediaProducto(idProducto, media) {
    const producto = await galeriaRepository.obtenerProductoPorId(idProducto);

    if (!producto) {
        throw crearErrorValidacion("Producto no encontrado");
    }

    const datosMedia = validarMedia(media);
    const idMedia = await galeriaRepository.agregarMediaProducto(idProducto, datosMedia);

    return await galeriaRepository.obtenerMediaProductoPorId(idMedia);
}

async function eliminarMediaServicio(idMedia) {
    return await galeriaRepository.eliminarMediaServicio(idMedia);
}

async function eliminarMediaProducto(idMedia) {
    return await galeriaRepository.eliminarMediaProducto(idMedia);
}

module.exports = {
    obtenerGaleriaServicio,
    obtenerGaleriaProducto,
    agregarMediaServicio,
    agregarMediaProducto,
    eliminarMediaServicio,
    eliminarMediaProducto
};
