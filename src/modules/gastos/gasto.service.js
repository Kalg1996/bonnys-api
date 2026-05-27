const gastoRepository = require("./gasto.repository");

async function obtenerTodos() {
    return await gastoRepository.obtenerTodos();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    return await gastoRepository.obtenerPorId(id);
}

async function crear(datos) {
    if (!datos.categoria || !datos.concepto || !datos.monto || !datos.metodo_pago) {
        return null;
    }

    const nuevoGasto = {
        categoria: datos.categoria,
        concepto: datos.concepto,
        monto: datos.monto,
        metodo_pago: datos.metodo_pago,
        fecha_gasto: datos.fecha_gasto || new Date(),
        id_usuario: datos.id_usuario || null,
        observaciones: datos.observaciones || null
    };

    const idCreado = await gastoRepository.crear(nuevoGasto);

    return await gastoRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const gastoExistente = await gastoRepository.obtenerPorId(id);

    if (!gastoExistente) {
        return null;
    }

    const gastoActualizado = {
        categoria: datos.categoria || gastoExistente.categoria,
        concepto: datos.concepto || gastoExistente.concepto,
        monto: datos.monto ?? gastoExistente.monto,
        metodo_pago: datos.metodo_pago || gastoExistente.metodo_pago,
        fecha_gasto: datos.fecha_gasto || gastoExistente.fecha_gasto,
        id_usuario: datos.id_usuario ?? gastoExistente.id_usuario,
        observaciones: datos.observaciones ?? gastoExistente.observaciones
    };

    await gastoRepository.actualizar(id, gastoActualizado);

    return await gastoRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const gastoExistente = await gastoRepository.obtenerPorId(id);

    if (!gastoExistente) {
        return null;
    }

    await gastoRepository.eliminar(id);

    return gastoExistente;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};