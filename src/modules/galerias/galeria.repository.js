const pool = require("../../config/db");

async function obtenerServicioPorId(idServicio) {
    const [rows] = await pool.query(
        "SELECT * FROM servicios WHERE id_servicio = ?",
        [idServicio]
    );

    return rows[0] || null;
}

async function obtenerProductoPorId(idProducto) {
    const [rows] = await pool.query(
        "SELECT * FROM productos WHERE id_producto = ?",
        [idProducto]
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

async function agregarMediaServicio(idServicio, media) {
    const [result] = await pool.query(
        `INSERT INTO servicios_galeria
         (id_servicio, tipo, url, orden)
         VALUES (?, ?, ?, ?)`,
        [idServicio, media.tipo, media.url, media.orden]
    );

    return result.insertId;
}

async function agregarMediaProducto(idProducto, media) {
    const [result] = await pool.query(
        `INSERT INTO productos_galeria
         (id_producto, tipo, url, orden)
         VALUES (?, ?, ?, ?)`,
        [idProducto, media.tipo, media.url, media.orden]
    );

    return result.insertId;
}

async function obtenerMediaServicioPorId(idMedia) {
    const [rows] = await pool.query(
        "SELECT * FROM servicios_galeria WHERE id_media = ?",
        [idMedia]
    );

    return rows[0] || null;
}

async function obtenerMediaProductoPorId(idMedia) {
    const [rows] = await pool.query(
        "SELECT * FROM productos_galeria WHERE id_media = ?",
        [idMedia]
    );

    return rows[0] || null;
}

async function eliminarMediaServicio(idMedia) {
    const [result] = await pool.query(
        "DELETE FROM servicios_galeria WHERE id_media = ?",
        [idMedia]
    );

    return result.affectedRows;
}

async function eliminarMediaProducto(idMedia) {
    const [result] = await pool.query(
        "DELETE FROM productos_galeria WHERE id_media = ?",
        [idMedia]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerServicioPorId,
    obtenerProductoPorId,
    obtenerGaleriaServicio,
    obtenerGaleriaProducto,
    agregarMediaServicio,
    agregarMediaProducto,
    obtenerMediaServicioPorId,
    obtenerMediaProductoPorId,
    eliminarMediaServicio,
    eliminarMediaProducto
};
