function crearErrorValidacion(mensaje) {
    const error = new Error(mensaje);
    error.statusCode = 400;
    return error;
}

function esTextoVacio(valor) {
    return typeof valor !== "string" || valor.trim().length === 0;
}

function validarTextoRequerido(valor, campo) {
    if (esTextoVacio(valor)) {
        throw crearErrorValidacion(`${campo} no puede ir vacío`);
    }
}

function validarCorreo(correo) {
    if (!correo) return;

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!correoValido) {
        throw crearErrorValidacion("correo debe tener formato válido");
    }
}

function validarTelefono(telefono, campo = "telefono1") {
    if (!telefono) return;

    if (String(telefono).trim().length < 8) {
        throw crearErrorValidacion(`${campo} debe tener mínimo 8 caracteres`);
    }
}

function validarNumeroMinimo(valor, campo, minimo = 0) {
    const numero = Number(valor);

    if (Number.isNaN(numero) || numero < minimo) {
        throw crearErrorValidacion(`${campo} debe ser mayor o igual a ${minimo}`);
    }
}

function validarFechaRequerida(valor, campo) {
    if (!valor) {
        throw crearErrorValidacion(`${campo} no puede ir vacío`);
    }
}

function validarRangoHoras(horaInicio, horaFin) {
    validarFechaRequerida(horaInicio, "hora_inicio");
    validarFechaRequerida(horaFin, "hora_fin");

    if (horaFin <= horaInicio) {
        throw crearErrorValidacion("hora_fin debe ser mayor que hora_inicio");
    }
}

module.exports = {
    crearErrorValidacion,
    validarTextoRequerido,
    validarCorreo,
    validarTelefono,
    validarNumeroMinimo,
    validarFechaRequerida,
    validarRangoHoras
};
