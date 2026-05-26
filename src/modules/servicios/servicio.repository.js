const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(
        "SELECT * FROM servicios ORDER BY id_servicio DESC"
    );

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM servicios WHERE id_servicio = ?",
        [id]
    );

    return rows[0];
}

async function crear(servicio) {
    const [result] = await pool.query(
        `INSERT INTO servicios
    (nombre, descripcion, precio, duracion_minutos, estado, url_foto, url_video)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            servicio.nombre,
            servicio.descripcion,
            servicio.precio,
            servicio.duracion_minutos,
            servicio.estado,
            servicio.url_foto,
            servicio.url_video
        ]
    );

    return result.insertId;
}

async function actualizar(id, servicio) {
    const [result] = await pool.query(
        `UPDATE servicios
     SET nombre = ?, descripcion = ?, precio = ?, duracion_minutos = ?,
         estado = ?, url_foto = ?, url_video = ?
     WHERE id_servicio = ?`,
        [
            servicio.nombre,
            servicio.descripcion,
            servicio.precio,
            servicio.duracion_minutos,
            servicio.estado,
            servicio.url_foto,
            servicio.url_video,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM servicios WHERE id_servicio = ?",
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