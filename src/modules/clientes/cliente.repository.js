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

async function crear(cliente) {
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

async function actualizar(id, cliente) {
    const [result] = await pool.query(
        `UPDATE clientes
     SET nombre = ?, apellido = ?, telefono1 = ?, telefono2 = ?, correo = ?, direccion = ?
     WHERE id_cliente = ?`,
        [
            cliente.nombre,
            cliente.apellido,
            cliente.telefono1,
            cliente.telefono2,
            cliente.correo,
            cliente.direccion,
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
    crear,
    actualizar,
    eliminar
};