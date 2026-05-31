const publicRepository = require("./public.repository");
const {
    crearErrorValidacion,
    validarTextoRequerido,
    validarCorreo,
    validarTelefono,
    validarFechaRequerida,
    validarRangoHoras
} = require("../../utils/validation");

async function obtenerServicios() {
    return await publicRepository.obtenerServiciosActivos();
}

async function obtenerProductos() {
    return await publicRepository.obtenerProductosActivos();
}

async function agendarCita(datos) {
    if (!datos.id_servicio) {
        return null;
    }

    validarTextoRequerido(datos.nombre, "nombre");
    validarTextoRequerido(datos.apellido, "apellido");
    validarCorreo(datos.correo);
    validarTelefono(datos.telefono1);
    validarFechaRequerida(datos.fecha_cita, "fecha_cita");
    validarRangoHoras(datos.hora_inicio, datos.hora_fin);

    const idUsuario = 1;
    const existeCruce = await publicRepository.existeCruceHorario(
        idUsuario,
        datos.fecha_cita,
        datos.hora_inicio,
        datos.hora_fin
    );

    if (existeCruce) {
        throw crearErrorValidacion("Ya existe una cita en ese horario");
    }

    let cliente = await publicRepository.buscarClientePorTelefonoOCorreo(
        datos.telefono1,
        datos.correo
    );

    if (!cliente) {
        const idCliente = await publicRepository.crearCliente({
            nombre: datos.nombre,
            apellido: datos.apellido,
            telefono1: datos.telefono1 || null,
            telefono2: datos.telefono2 || null,
            correo: datos.correo || null,
            direccion: datos.direccion || null
        });

        cliente = await publicRepository.obtenerClientePorId(idCliente);
    }

    const idCita = await publicRepository.crearCita({
        id_cliente: cliente.id_cliente,
        id_usuario: idUsuario,
        id_servicio: datos.id_servicio,
        fecha_cita: datos.fecha_cita,
        hora_inicio: datos.hora_inicio,
        hora_fin: datos.hora_fin,
        estado: "PENDIENTE",
        observaciones: datos.observaciones || null
    });

    return await publicRepository.obtenerCitaPorId(idCita);
}

module.exports = {
    obtenerServicios,
    obtenerProductos,
    agendarCita
};
