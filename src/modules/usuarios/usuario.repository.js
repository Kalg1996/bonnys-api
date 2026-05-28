const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(
        "SELECT id_usuario, nombre, apellido, telefono1, telefono2, correo, nombre_usuario, rol, estado, url_foto, fecha_registro FROM usuarios"
    );

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT id_usuario, nombre, apellido, telefono1, telefono2, correo, nombre_usuario, rol, estado, url_foto, fecha_registro FROM usuarios WHERE id_usuario = ?",
        [id]
    );

    return rows[0];
}

async function crear(usuario) {
    const [result] = await pool.query(
        `INSERT INTO usuarios
         (nombre, apellido, telefono1, telefono2, correo, nombre_usuario, password, rol, estado, url_foto)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            usuario.nombre,
            usuario.apellido,
            usuario.telefono1,
            usuario.telefono2,
            usuario.correo,
            usuario.nombre_usuario,
            usuario.password,
            usuario.rol,
            usuario.estado,
            usuario.url_foto
        ]
    );

    return result.insertId;
}

async function actualizar(id, usuario) {
    const [result] = await pool.query(
        `UPDATE usuarios 
     SET nombre = ?, apellido = ?, telefono1 = ?, telefono2 = ?, correo = ?, 
         nombre_usuario = ?, rol = ?, estado = ?, url_foto = ?
     WHERE id_usuario = ?`,
        [
            usuario.nombre,
            usuario.apellido,
            usuario.telefono1,
            usuario.telefono2,
            usuario.correo,
            usuario.nombre_usuario,
            usuario.rol,
            usuario.estado,
            usuario.url_foto,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM usuarios WHERE id_usuario = ?",
        [id]
    );

    return result.affectedRows;
}


async function obtenerPorNombreUsuario(nombre_usuario) {
    const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE nombre_usuario = ?",
        [nombre_usuario]
    );

    return rows[0];
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorNombreUsuario,
    crear,
    actualizar,
    eliminar
};