const horarioSalonRepository = require("./horarioSalon.repository");
const {
    crearErrorValidacion,
    validarFechaRequerida,
    validarRangoHoras
} = require("../../utils/validation");

function validarBooleano(valor) {
    if (typeof valor !== "boolean") {
        throw crearErrorValidacion("activo debe ser booleano");
    }
}

async function obtenerTodos() {
    return await horarioSalonRepository.obtenerTodos();
}

async function obtenerPorId(id) {
    return await horarioSalonRepository.obtenerPorId(id);
}

async function actualizar(id, datos) {
    const horario = await horarioSalonRepository.obtenerPorId(id);

    if (!horario) {
        return null;
    }

    validarFechaRequerida(datos.hora_inicio, "hora_inicio");
    validarFechaRequerida(datos.hora_fin, "hora_fin");
    validarRangoHoras(datos.hora_inicio, datos.hora_fin);
    validarBooleano(datos.activo);

    await horarioSalonRepository.actualizar(id, {
        hora_inicio: datos.hora_inicio,
        hora_fin: datos.hora_fin,
        activo: datos.activo
    });

    return await horarioSalonRepository.obtenerPorId(id);
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    actualizar
};
