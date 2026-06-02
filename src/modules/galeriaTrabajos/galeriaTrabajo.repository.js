const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(
        "SELECT * FROM galeria_trabajos ORDER BY destacado DESC, id_trabajo DESC"
    );

    return rows;
}

async function obtenerPublicos() {
    const [rows] = await pool.query(
        `SELECT * FROM galeria_trabajos
         WHERE estado = TRUE
         ORDER BY destacado DESC, id_trabajo DESC`
    );

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM galeria_trabajos WHERE id_trabajo = ?",
        [id]
    );

    return rows[0];
}

async function crear(trabajo) {
    const [result] = await pool.query(
        `INSERT INTO galeria_trabajos
         (titulo, descripcion, tipo, url_media, destacado, estado)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            trabajo.titulo,
            trabajo.descripcion,
            trabajo.tipo,
            trabajo.url_media,
            trabajo.destacado,
            trabajo.estado
        ]
    );

    return result.insertId;
}

async function actualizar(id, trabajo) {
    const [result] = await pool.query(
        `UPDATE galeria_trabajos
         SET titulo = ?, descripcion = ?, tipo = ?, url_media = ?,
             destacado = ?, estado = ?
         WHERE id_trabajo = ?`,
        [
            trabajo.titulo,
            trabajo.descripcion,
            trabajo.tipo,
            trabajo.url_media,
            trabajo.destacado,
            trabajo.estado,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM galeria_trabajos WHERE id_trabajo = ?",
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
