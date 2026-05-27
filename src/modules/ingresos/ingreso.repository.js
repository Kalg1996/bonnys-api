const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(`
    SELECT 
      i.id_ingreso,
      i.tipo_ingreso,
      i.concepto,
      i.monto,
      i.metodo_pago,
      i.fecha_ingreso,
      i.id_cliente,
      CONCAT(c.nombre, ' ', c.apellido) AS cliente,
      i.id_usuario,
      CONCAT(u.nombre, ' ', u.apellido) AS usuario,
      i.observaciones
    FROM ingresos i
    LEFT JOIN clientes c ON i.id_cliente = c.id_cliente
    LEFT JOIN usuarios u ON i.id_usuario = u.id_usuario
    ORDER BY i.fecha_ingreso DESC
  `);

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM ingresos WHERE id_ingreso = ?",
        [id]
    );

    return rows[0];
}

async function crear(ingreso) {
    const [result] = await pool.query(
        `INSERT INTO ingresos
    (tipo_ingreso, concepto, monto, metodo_pago, fecha_ingreso, id_cliente, id_usuario, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            ingreso.tipo_ingreso,
            ingreso.concepto,
            ingreso.monto,
            ingreso.metodo_pago,
            ingreso.fecha_ingreso,
            ingreso.id_cliente,
            ingreso.id_usuario,
            ingreso.observaciones
        ]
    );

    return result.insertId;
}

async function actualizar(id, ingreso) {
    const [result] = await pool.query(
        `UPDATE ingresos
     SET tipo_ingreso = ?, concepto = ?, monto = ?, metodo_pago = ?,
         fecha_ingreso = ?, id_cliente = ?, id_usuario = ?, observaciones = ?
     WHERE id_ingreso = ?`,
        [
            ingreso.tipo_ingreso,
            ingreso.concepto,
            ingreso.monto,
            ingreso.metodo_pago,
            ingreso.fecha_ingreso,
            ingreso.id_cliente,
            ingreso.id_usuario,
            ingreso.observaciones,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM ingresos WHERE id_ingreso = ?",
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