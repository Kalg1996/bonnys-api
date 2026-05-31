const pool = require("../../config/db");

async function obtenerTodos() {
    const [rows] = await pool.query(
        `SELECT *
         FROM horarios_salon
         ORDER BY FIELD(
             dia_semana,
             'LUNES',
             'MARTES',
             'MIERCOLES',
             'JUEVES',
             'VIERNES',
             'SABADO',
             'DOMINGO'
         )`
    );

    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(
        "SELECT * FROM horarios_salon WHERE id_horario = ?",
        [id]
    );

    return rows[0] || null;
}

async function obtenerPorDia(diaSemana) {
    const [rows] = await pool.query(
        "SELECT * FROM horarios_salon WHERE dia_semana = ?",
        [diaSemana]
    );

    return rows[0] || null;
}

async function actualizar(id, horario) {
    const [result] = await pool.query(
        `UPDATE horarios_salon
         SET hora_inicio = ?, hora_fin = ?, activo = ?
         WHERE id_horario = ?`,
        [horario.hora_inicio, horario.hora_fin, horario.activo, id]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorDia,
    actualizar
};
