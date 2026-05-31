const gastoRepository = require("./gasto.repository");
const {
    validarTextoRequerido,
    validarNumeroMinimo
} = require("../../utils/validation");

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
    validarTextoRequerido(datos.categoria, "categoria");
    validarTextoRequerido(datos.concepto, "concepto");
    validarNumeroMinimo(datos.monto, "monto", 0);
    validarTextoRequerido(datos.metodo_pago, "metodo_pago");

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
        categoria: datos.categoria ?? gastoExistente.categoria,
        concepto: datos.concepto ?? gastoExistente.concepto,
        monto: datos.monto ?? gastoExistente.monto,
        metodo_pago: datos.metodo_pago ?? gastoExistente.metodo_pago,
        fecha_gasto: datos.fecha_gasto || gastoExistente.fecha_gasto,
        id_usuario: datos.id_usuario ?? gastoExistente.id_usuario,
        observaciones: datos.observaciones ?? gastoExistente.observaciones
    };

    validarTextoRequerido(gastoActualizado.categoria, "categoria");
    validarTextoRequerido(gastoActualizado.concepto, "concepto");
    validarNumeroMinimo(gastoActualizado.monto, "monto", 0);
    validarTextoRequerido(gastoActualizado.metodo_pago, "metodo_pago");

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
