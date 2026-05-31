const ingresoRepository = require("./ingreso.repository");
const {
    validarTextoRequerido,
    validarNumeroMinimo
} = require("../../utils/validation");

async function obtenerTodos() {
    return await ingresoRepository.obtenerTodos();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    return await ingresoRepository.obtenerPorId(id);
}

async function crear(datos) {
    validarTextoRequerido(datos.tipo_ingreso, "tipo_ingreso");
    validarTextoRequerido(datos.concepto, "concepto");
    validarNumeroMinimo(datos.monto, "monto", 0);
    validarTextoRequerido(datos.metodo_pago, "metodo_pago");

    const nuevoIngreso = {
        tipo_ingreso: datos.tipo_ingreso,
        concepto: datos.concepto,
        monto: datos.monto,
        metodo_pago: datos.metodo_pago,
        fecha_ingreso: datos.fecha_ingreso || new Date(),
        id_cliente: datos.id_cliente || null,
        id_usuario: datos.id_usuario || null,
        observaciones: datos.observaciones || null
    };

    const idCreado = await ingresoRepository.crear(nuevoIngreso);

    return await ingresoRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const ingresoExistente = await ingresoRepository.obtenerPorId(id);

    if (!ingresoExistente) {
        return null;
    }

    const ingresoActualizado = {
        tipo_ingreso: datos.tipo_ingreso ?? ingresoExistente.tipo_ingreso,
        concepto: datos.concepto ?? ingresoExistente.concepto,
        monto: datos.monto ?? ingresoExistente.monto,
        metodo_pago: datos.metodo_pago ?? ingresoExistente.metodo_pago,
        fecha_ingreso: datos.fecha_ingreso || ingresoExistente.fecha_ingreso,
        id_cliente: datos.id_cliente ?? ingresoExistente.id_cliente,
        id_usuario: datos.id_usuario ?? ingresoExistente.id_usuario,
        observaciones: datos.observaciones ?? ingresoExistente.observaciones
    };

    validarTextoRequerido(ingresoActualizado.tipo_ingreso, "tipo_ingreso");
    validarTextoRequerido(ingresoActualizado.concepto, "concepto");
    validarNumeroMinimo(ingresoActualizado.monto, "monto", 0);
    validarTextoRequerido(ingresoActualizado.metodo_pago, "metodo_pago");

    await ingresoRepository.actualizar(id, ingresoActualizado);

    return await ingresoRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const ingresoExistente = await ingresoRepository.obtenerPorId(id);

    if (!ingresoExistente) {
        return null;
    }

    await ingresoRepository.eliminar(id);

    return ingresoExistente;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
