const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(`
    SELECT 
      g.id_gasto,
      g.categoria,
      g.concepto,
      g.monto,
      g.metodo_pago,
      g.fecha_gasto,
      g.id_usuario,
      CONCAT(u.nombre, ' ', u.apellido) AS usuario,
      g.observaciones
    FROM gastos g
    LEFT JOIN usuarios u ON g.id_usuario = u.id_usuario
    ORDER BY g.fecha_gasto DESC
  `);

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM gastos WHERE id_gasto = ?",
        [id]
    );

    return rows[0];
}

async function crear(gasto) {
    const [result] = await pool.query(
        `INSERT INTO gastos
    (categoria, concepto, monto, metodo_pago, fecha_gasto, id_usuario, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            gasto.categoria,
            gasto.concepto,
            gasto.monto,
            gasto.metodo_pago,
            gasto.fecha_gasto,
            gasto.id_usuario,
            gasto.observaciones
        ]
    );

    return result.insertId;
}

async function actualizar(id, gasto) {
    const [result] = await pool.query(
        `UPDATE gastos
     SET categoria = ?, concepto = ?, monto = ?, metodo_pago = ?,
         fecha_gasto = ?, id_usuario = ?, observaciones = ?
     WHERE id_gasto = ?`,
        [
            gasto.categoria,
            gasto.concepto,
            gasto.monto,
            gasto.metodo_pago,
            gasto.fecha_gasto,
            gasto.id_usuario,
            gasto.observaciones,
            id
        ]
    );

    return result.affectedRows;
}

async function eliminar(id) {
    const [result] = await pool.query(
        "DELETE FROM gastos WHERE id_gasto = ?",
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