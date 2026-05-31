const citaRepository = require("./cita.repository");
const {
    crearErrorValidacion,
    validarFechaRequerida,
    validarRangoHoras
} = require("../../utils/validation");

async function obtenerTodos() {
    return await citaRepository.obtenerTodos();
}

async function obtenerPorId(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    return await citaRepository.obtenerPorId(id);
}

async function crear(datos) {
    if (
        !datos.id_cliente ||
        !datos.id_usuario ||
        !datos.id_servicio ||
        !datos.fecha_cita ||
        !datos.hora_inicio ||
        !datos.hora_fin
    ) {
        return null;
    }

    validarFechaRequerida(datos.fecha_cita, "fecha_cita");
    validarRangoHoras(datos.hora_inicio, datos.hora_fin);

    const existeCruce = await citaRepository.existeCruceHorario(
        datos.id_usuario,
        datos.fecha_cita,
        datos.hora_inicio,
        datos.hora_fin
    );

    if (existeCruce) {
        throw crearErrorValidacion("Ya existe una cita en ese horario");
    }

    const nuevaCita = {
        id_cliente: datos.id_cliente,
        id_usuario: datos.id_usuario,
        id_servicio: datos.id_servicio,
        fecha_cita: datos.fecha_cita,
        hora_inicio: datos.hora_inicio,
        hora_fin: datos.hora_fin,
        estado: datos.estado || "PENDIENTE",
        observaciones: datos.observaciones || null
    };

    const idCreado = await citaRepository.crear(nuevaCita);

    return await citaRepository.obtenerPorId(idCreado);
}

async function actualizar(id, datos) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const citaExistente = await citaRepository.obtenerPorId(id);

    if (!citaExistente) {
        return null;
    }

    const citaActualizada = {
        id_cliente: datos.id_cliente ?? citaExistente.id_cliente,
        id_usuario: datos.id_usuario ?? citaExistente.id_usuario,
        id_servicio: datos.id_servicio ?? citaExistente.id_servicio,
        fecha_cita: datos.fecha_cita ?? citaExistente.fecha_cita,
        hora_inicio: datos.hora_inicio ?? citaExistente.hora_inicio,
        hora_fin: datos.hora_fin ?? citaExistente.hora_fin,
        estado: datos.estado ?? citaExistente.estado,
        observaciones: datos.observaciones ?? citaExistente.observaciones
    };

    validarFechaRequerida(citaActualizada.fecha_cita, "fecha_cita");
    validarRangoHoras(citaActualizada.hora_inicio, citaActualizada.hora_fin);

    const existeCruce = await citaRepository.existeCruceHorario(
        citaActualizada.id_usuario,
        citaActualizada.fecha_cita,
        citaActualizada.hora_inicio,
        citaActualizada.hora_fin,
        id
    );

    if (existeCruce) {
        throw crearErrorValidacion("Ya existe una cita en ese horario");
    }

    await citaRepository.actualizar(id, citaActualizada);

    return await citaRepository.obtenerPorId(id);
}

async function eliminar(id) {
    if (isNaN(id) || id <= 0) {
        return null;
    }

    const citaExistente = await citaRepository.obtenerPorId(id);

    if (!citaExistente) {
        return null;
    }

    await citaRepository.eliminar(id);

    return citaExistente;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
