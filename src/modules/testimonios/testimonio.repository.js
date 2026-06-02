const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(
        "SELECT * FROM testimonios ORDER BY id_testimonio DESC"
    );

    return rows;
}

async function obtenerPublicos() {
    const [rows] = await pool.query(
        "SELECT * FROM testimonios WHERE estado = TRUE ORDER BY id_testimonio DESC"
    );

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM testimonios WHERE id_testimonio = ?",
        [id]
    );

    return rows[0];
}

async function crear(testimonio) {
    const [result] = await pool.query(
        `INSERT INTO testimonios
         (nombre_cliente, comentario, calificacion, url_foto, estado)
         VALUES (?, ?, ?, ?, ?)`,
        [
            testimonio.nombre_cliente,
            testimonio.comentario,
            testimonio.calificacion,
            testimonio.url_foto,
            testimonio.estado
        ]
    );

    return result.insertId;
}

async function actualizar(id, testimonio) {
    const [result] = await pool.query(
        `UPDATE testimonios
         SET nombre_cliente = ?, comentario = ?, calificacion = ?,
             url_foto = ?, estado = ?
         WHERE id_testimonio = ?`,
        [
            testimonio.nombre_cliente,
            testimonio.comentario,
            testimonio.calificacion,
            testimonio.url_foto,
            testimonio.estado,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM testimonios WHERE id_testimonio = ?",
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerTodos,
    obtenerPublicos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
