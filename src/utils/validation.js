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

function validarFechaOpcionalNoFutura(valor, campo) {
    if (!valor) return null;

    const fecha = String(valor).trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        throw crearErrorValidacion(`${campo} debe tener formato YYYY-MM-DD`);
    }

    const [year, month, day] = fecha.split("-").map(Number);
    const fechaDate = new Date(year, month - 1, day);

    if (
        Number.isNaN(fechaDate.getTime()) ||
        fechaDate.getFullYear() !== year ||
        fechaDate.getMonth() !== month - 1 ||
        fechaDate.getDate() !== day
    ) {
        throw crearErrorValidacion(`${campo} debe ser una fecha válida`);
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaDate > hoy) {
        throw crearErrorValidacion(`${campo} no puede ser una fecha futura`);
    }

    return fecha;
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
    validarFechaOpcionalNoFutura,
    validarRangoHoras
};
