const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(
        "SELECT * FROM promociones ORDER BY id_promocion DESC"
    );

    return rows;
}

async function obtenerPublicas() {
    const [rows] = await pool.query(
        `SELECT * FROM promociones
         WHERE estado = TRUE
           AND (fecha_inicio IS NULL OR fecha_inicio <= CURDATE())
           AND (fecha_fin IS NULL OR fecha_fin >= CURDATE())
         ORDER BY id_promocion DESC`
    );

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM promociones WHERE id_promocion = ?",
        [id]
    );

    return rows[0];
}

async function crear(promocion) {
    const [result] = await pool.query(
        `INSERT INTO promociones
         (titulo, descripcion, precio_original, precio_promocion,
          url_imagen, fecha_inicio, fecha_fin, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            promocion.titulo,
            promocion.descripcion,
            promocion.precio_original,
            promocion.precio_promocion,
            promocion.url_imagen,
            promocion.fecha_inicio,
            promocion.fecha_fin,
            promocion.estado
        ]
    );

    return result.insertId;
}

async function actualizar(id, promocion) {
    const [result] = await pool.query(
        `UPDATE promociones
         SET titulo = ?, descripcion = ?, precio_original = ?,
             precio_promocion = ?, url_imagen = ?, fecha_inicio = ?,
             fecha_fin = ?, estado = ?
         WHERE id_promocion = ?`,
        [
            promocion.titulo,
            promocion.descripcion,
            promocion.precio_original,
            promocion.precio_promocion,
            promocion.url_imagen,
            promocion.fecha_inicio,
            promocion.fecha_fin,
            promocion.estado,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM promociones WHERE id_promocion = ?",
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerTodos,
    obtenerPublicas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
