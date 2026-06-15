const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(
        "SELECT * FROM clientes ORDER BY id_cliente DESC"
    );

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM clientes WHERE id_cliente = ?",
        [id]
    );

    return rows[0];
}

async function obtenerCumpleaniosProximos() {
    const [rows] = await pool.query(
        `SELECT
            id_cliente,
            nombre,
            apellido,
            telefono1,
            correo,
            fecha_nacimiento,
            CASE
                WHEN DATE_FORMAT(fecha_nacimiento, '%m-%d') = DATE_FORMAT(CURDATE(), '%m-%d') THEN 0
                WHEN DATE_FORMAT(fecha_nacimiento, '%m-%d') = DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '%m-%d') THEN 1
                WHEN DATE_FORMAT(fecha_nacimiento, '%m-%d') = DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '%m-%d') THEN 2
            END AS dias_restantes
        FROM clientes
        WHERE fecha_nacimiento IS NOT NULL
            AND DATE_FORMAT(fecha_nacimiento, '%m-%d') IN (
                DATE_FORMAT(CURDATE(), '%m-%d'),
                DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '%m-%d'),
                DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '%m-%d')
            )
        ORDER BY dias_restantes ASC, nombre ASC, apellido ASC`
    );

    return rows;
}

async function crear(cliente) {
    const [result] = await pool.query(
        `INSERT INTO clientes 
    (nombre, apellido, telefono1, telefono2, correo, direccion, fecha_nacimiento)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            cliente.nombre,
            cliente.apellido,
            cliente.telefono1,
            cliente.telefono2,
            cliente.correo,
            cliente.direccion,
            cliente.fecha_nacimiento
        ]
    );

    return result.insertId;
}

async function actualizar(id, cliente) {
    const [result] = await pool.query(
        `UPDATE clientes
     SET nombre = ?, apellido = ?, telefono1 = ?, telefono2 = ?, correo = ?, direccion = ?, fecha_nacimiento = ?
     WHERE id_cliente = ?`,
        [
            cliente.nombre,
            cliente.apellido,
            cliente.telefono1,
            cliente.telefono2,
            cliente.correo,
            cliente.direccion,
            cliente.fecha_nacimiento,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM clientes WHERE id_cliente = ?",
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerCumpleaniosProximos,
    crear,
    actualizar,
    eliminar
};
