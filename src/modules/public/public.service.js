const publicRepository = require("./public.repository");
const {
    crearErrorValidacion,
    validarTextoRequerido,
    validarCorreo,
    validarTelefono,
    validarFechaRequerida,
    validarFechaOpcionalNoFutura,
    validarRangoHoras
} = require("../../utils/validation");

async function obtenerServicios() {
    return await publicRepository.obtenerServiciosActivos();
}

async function obtenerProductos() {
    return await publicRepository.obtenerProductosActivos();
}

async function obtenerGaleriaServicio(idServicio) {
    const servicio = await publicRepository.obtenerServicioActivoPorId(idServicio);

    if (!servicio) {
        throw crearErrorValidacion("Servicio no encontrado");
    }

    return await publicRepository.obtenerGaleriaServicio(idServicio);
}

async function obtenerGaleriaProducto(idProducto) {
    const producto = await publicRepository.obtenerProductoActivoPorId(idProducto);

    if (!producto) {
        throw crearErrorValidacion("Producto no encontrado");
    }

    return await publicRepository.obtenerGaleriaProducto(idProducto);
}

function horaAMinutos(hora) {
    const [horas, minutos] = String(hora).slice(0, 5).split(":").map(Number);

    return horas * 60 + minutos;
}

function minutosAHora(totalMinutos) {
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function obtenerFechaLocalActual() {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, "0");
    const day = String(ahora.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function obtenerMinutosActuales() {
    const ahora = new Date();

    return ahora.getHours() * 60 + ahora.getMinutes();
}

function validarFechaHoraFutura(fecha, horaInicio) {
    const hoy = obtenerFechaLocalActual();

    if (
        fecha < hoy ||
        (fecha === hoy && horaAMinutos(horaInicio) <= obtenerMinutosActuales())
    ) {
        throw crearErrorValidacion("No puedes agendar una cita en una fecha u hora pasada");
    }
}

function obtenerDiaSemana(fecha) {
    const dias = [
        "DOMINGO",
        "LUNES",
        "MARTES",
        "MIERCOLES",
        "JUEVES",
        "VIERNES",
        "SABADO"
    ];
    const fechaLocal = new Date(`${fecha}T00:00:00`);

    return dias[fechaLocal.getDay()];
}

function existeCruce(slotInicio, slotFin, citas) {
    return citas.some((cita) => {
        const citaInicio = horaAMinutos(cita.hora_inicio);
        const citaFin = horaAMinutos(cita.hora_fin);

        return slotInicio < citaFin && slotFin > citaInicio;
    });
}

async function obtenerDisponibilidad(fecha, idServicio) {
    if (!fecha || !idServicio) {
        throw crearErrorValidacion("fecha e id_servicio son obligatorios");
    }

    validarFechaRequerida(fecha, "fecha");

    const hoy = obtenerFechaLocalActual();

    if (fecha < hoy) {
        return {
            fecha,
            id_servicio: Number(idServicio),
            mensaje: "No puedes seleccionar una fecha pasada",
            horarios: []
        };
    }

    const servicio = await publicRepository.obtenerServicioActivoPorId(idServicio);

    if (!servicio) {
        throw crearErrorValidacion("Servicio no encontrado");
    }

    const duracion = Number(servicio.duracion_minutos);

    if (!duracion || duracion <= 0) {
        throw crearErrorValidacion("El servicio no tiene una duración válida");
    }

    const diaSemana = obtenerDiaSemana(fecha);
    const horarioSalon = await publicRepository.obtenerHorarioSalonPorDia(diaSemana);

    if (!horarioSalon || !horarioSalon.activo) {
        return {
            fecha,
            id_servicio: Number(idServicio),
            mensaje: "El salón está cerrado ese día",
            horarios: []
        };
    }

    const inicioLaboral = horaAMinutos(horarioSalon.hora_inicio);
    const finLaboral = horaAMinutos(horarioSalon.hora_fin);
    const citas = await publicRepository.obtenerCitasPorFecha(fecha);
    const horarios = [];
    const esHoy = fecha === hoy;
    const minutosActuales = obtenerMinutosActuales();

    for (let inicio = inicioLaboral; inicio + duracion <= finLaboral; inicio += duracion) {
        const fin = inicio + duracion;

        if (esHoy && inicio <= minutosActuales) {
            continue;
        }

        horarios.push({
            hora_inicio: minutosAHora(inicio),
            hora_fin: minutosAHora(fin),
            disponible: !existeCruce(inicio, fin, citas)
        });
    }

    const mensaje = esHoy && horarios.length === 0
        ? "Ya no hay horarios disponibles para hoy"
        : "";

    return {
        fecha,
        id_servicio: Number(idServicio),
        dia_semana: diaSemana,
        hora_inicio_salon: minutosAHora(inicioLaboral),
        hora_fin_salon: minutosAHora(finLaboral),
        mensaje,
        horarios
    };
}

async function agendarCita(datos) {
    if (!datos.id_servicio) {
        return null;
    }

    validarTextoRequerido(datos.nombre, "nombre");
    validarTextoRequerido(datos.apellido, "apellido");
    validarCorreo(datos.correo);
    validarTelefono(datos.telefono1);
    const fechaNacimiento = validarFechaOpcionalNoFutura(
        datos.fecha_nacimiento,
        "fecha_nacimiento"
    );
    validarFechaRequerida(datos.fecha_cita, "fecha_cita");
    validarRangoHoras(datos.hora_inicio, datos.hora_fin);
    validarFechaHoraFutura(datos.fecha_cita, datos.hora_inicio);

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
            direccion: datos.direccion || null,
            fecha_nacimiento: fechaNacimiento
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
    obtenerGaleriaServicio,
    obtenerGaleriaProducto,
    obtenerDisponibilidad,
    agendarCita
};
