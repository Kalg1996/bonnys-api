const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(`
        SELECT
            c.id_cita,
            c.id_cliente,
            CONCAT(cl.nombre, ' ', cl.apellido) AS cliente,
            c.id_usuario,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario,
            c.id_servicio,
            s.nombre AS servicio,
            c.fecha_cita,
            c.hora_inicio,
            c.hora_fin,
            c.estado,
            c.observaciones,
            c.fecha_registro
        FROM citas c
                 INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
                 INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
                 INNER JOIN servicios s ON c.id_servicio = s.id_servicio
        ORDER BY c.fecha_cita DESC, c.hora_inicio DESC
    `);

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM citas WHERE id_cita = ?",
        [id]
    );

    return rows[0];
}

async function crear(cita) {
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

async function actualizar(id, cita) {
    const [result] = await pool.query(
        `UPDATE citas
         SET id_cliente = ?, id_usuario = ?, id_servicio = ?, fecha_cita = ?,
             hora_inicio = ?, hora_fin = ?, estado = ?, observaciones = ?
         WHERE id_cita = ?`,
        [
            cita.id_cliente,
            cita.id_usuario,
            cita.id_servicio,
            cita.fecha_cita,
            cita.hora_inicio,
            cita.hora_fin,
            cita.estado,
            cita.observaciones,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM citas WHERE id_cita = ?",
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};