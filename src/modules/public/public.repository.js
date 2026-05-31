const pool = require("../../config/db");

async function obtenerServiciosActivos() {
    const [rows] = await pool.query(
        "SELECT * FROM servicios WHERE estado = true ORDER BY nombre ASC"
    );

    return rows;
}

async function obtenerServicioActivoPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM servicios WHERE id_servicio = ? AND estado = true",
        [id]
    );

    return rows[0] || null;
}

async function obtenerProductosActivos() {
    const [rows] = await pool.query(
        "SELECT * FROM productos WHERE estado = true ORDER BY nombre ASC"
    );

    return rows;
}

async function obtenerProductoActivoPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM productos WHERE id_producto = ? AND estado = true",
        [id]
    );

    return rows[0] || null;
}

async function obtenerGaleriaServicio(idServicio) {
    const [rows] = await pool.query(
        "SELECT * FROM servicios_galeria WHERE id_servicio = ? ORDER BY orden ASC, id_media ASC",
        [idServicio]
    );

    return rows;
}

async function obtenerGaleriaProducto(idProducto) {
    const [rows] = await pool.query(
        "SELECT * FROM productos_galeria WHERE id_producto = ? ORDER BY orden ASC, id_media ASC",
        [idProducto]
    );

    return rows;
}

async function obtenerCitasPorFecha(fecha) {
    const [rows] = await pool.query(
        `SELECT id_cita, id_usuario, fecha_cita, hora_inicio, hora_fin, estado
         FROM citas
         WHERE fecha_cita = ?
           AND estado <> 'CANCELADA'
         ORDER BY hora_inicio ASC`,
        [fecha]
    );

    return rows;
}

async function buscarClientePorTelefonoOCorreo(telefono1, correo) {
    const filtros = [];
    const valores = [];

    if (telefono1) {
        filtros.push("telefono1 = ?");
        valores.push(telefono1);
    }

    if (correo) {
        filtros.push("correo = ?");
        valores.push(correo);
    }

    if (filtros.length === 0) {
        return null;
    }

    const [rows] = await pool.query(
        `SELECT * FROM clientes WHERE ${filtros.join(" OR ")} LIMIT 1`,
        valores
    );

    return rows[0] || null;
}

async function crearCliente(cliente) {
    const [result] = await pool.query(
        `INSERT INTO clientes
         (nombre, apellido, telefono1, telefono2, correo, direccion)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            cliente.nombre,
            cliente.apellido,
            cliente.telefono1,
            cliente.telefono2,
            cliente.correo,
            cliente.direccion
        ]
    );

    return result.insertId;
}

async function obtenerClientePorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM clientes WHERE id_cliente = ?",
        [id]
    );

    return rows[0] || null;
}

async function crearCita(cita) {
    const [result] = await pool.query(
        `INSERT INTO citas
         (id_cliente, id_usuario, id_servicio, fecha_cita, hora_inicio, hora_fin, estado, observaciones)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            cita.id_cliente,
            cita.id_usuario,
            cita.id_servicio,
            cita.fecha_cita,
            cita.hora_inicio,
            cita.hora_fin,
            cita.estado,
            cita.observaciones
        ]
    );

    return result.insertId;
}

async function existeCruceHorario(idUsuario, fechaCita, horaInicio, horaFin) {
    const [rows] = await pool.query(
        `SELECT id_cita
         FROM citas
         WHERE id_usuario = ?
           AND fecha_cita = ?
           AND estado <> 'CANCELADA'
           AND hora_inicio < ?
           AND hora_fin > ?
         LIMIT 1`,
        [idUsuario, fechaCita, horaFin, horaInicio]
    );

    return rows.length > 0;
}

async function obtenerCitaPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM citas WHERE id_cita = ?",
        [id]
    );

    return rows[0] || null;
}

module.exports = {
    obtenerServiciosActivos,
    obtenerServicioActivoPorId,
    obtenerProductosActivos,
    obtenerProductoActivoPorId,
    obtenerGaleriaServicio,
    obtenerGaleriaProducto,
    obtenerCitasPorFecha,
    buscarClientePorTelefonoOCorreo,
    crearCliente,
    obtenerClientePorId,
    crearCita,
    existeCruceHorario,
    obtenerCitaPorId
};
