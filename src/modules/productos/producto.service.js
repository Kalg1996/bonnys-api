const productoRepository = require("./producto.repository");

async function obtenerTodos() {
    return await productoRepository.obtenerTodos();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    return await productoRepository.obtenerPorId(id);
}

async function crear(datos) {
    if (!datos.nombre || datos.precio_venta === undefined) {
        return null;
    }

    const nuevoProducto = {
        nombre: datos.nombre,
        descripcion: datos.descripcion || null,
        precio_venta: datos.precio_venta,
        stock_actual: datos.stock_actual ?? 0,
        stock_minimo: datos.stock_minimo ?? 0,
        estado: datos.estado ?? true,
        url_foto: datos.url_foto || null,
        url_video: datos.url_video || null
    };

    const idCreado = await productoRepository.crear(nuevoProducto);

    return await productoRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const productoExistente = await productoRepository.obtenerPorId(id);

    if (!productoExistente) {
        return null;
    }

    const productoActualizado = {
        nombre: datos.nombre || productoExistente.nombre,
        descripcion: datos.descripcion ?? productoExistente.descripcion,
        precio_venta: datos.precio_venta ?? productoExistente.precio_venta,
        stock_actual: datos.stock_actual ?? productoExistente.stock_actual,
        stock_minimo: datos.stock_minimo ?? productoExistente.stock_minimo,
        estado: datos.estado ?? productoExistente.estado,
        url_foto: datos.url_foto ?? productoExistente.url_foto,
        url_video: datos.url_video ?? productoExistente.url_video
    };

    await productoRepository.actualizar(id, productoActualizado);

    return await productoRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const productoExistente = await productoRepository.obtenerPorId(id);

    if (!productoExistente) {
        return null;
    }

    await productoRepository.eliminar(id);

    return productoExistente;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};