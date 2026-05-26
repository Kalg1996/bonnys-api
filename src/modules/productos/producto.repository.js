const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(
        "SELECT * FROM productos ORDER BY id_producto DESC"
    );

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM productos WHERE id_producto = ?",
        [id]
    );

    return rows[0];
}

async function crear(producto) {
    const [result] = await pool.query(
        `INSERT INTO productos
    (nombre, descripcion, precio_venta, stock_actual, stock_minimo, estado, url_foto, url_video)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            producto.nombre,
            producto.descripcion,
            producto.precio_venta,
            producto.stock_actual,
            producto.stock_minimo,
            producto.estado,
            producto.url_foto,
            producto.url_video
        ]
    );

    return result.insertId;
}

async function actualizar(id, producto) {
    const [result] = await pool.query(
        `UPDATE productos
     SET nombre = ?, descripcion = ?, precio_venta = ?, stock_actual = ?,
         stock_minimo = ?, estado = ?, url_foto = ?, url_video = ?
     WHERE id_producto = ?`,
        [
            producto.nombre,
            producto.descripcion,
            producto.precio_venta,
            producto.stock_actual,
            producto.stock_minimo,
            producto.estado,
            producto.url_foto,
            producto.url_video,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM productos WHERE id_producto = ?",
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