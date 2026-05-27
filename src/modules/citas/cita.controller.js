const citaService = require("./cita.service");

async function obtenerTodos(req, res) {
    try {
        const citas = await citaService.obtenerTodos();

        res.status(200).json({
            mensaje: "Citas obtenidas correctamente",
            data: citas
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener citas",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const id = Number(req.params.id);

        const cita = await citaService.obtenerPorId(id);

        if (!cita) {
            return res.status(404).json({
                mensaje: "Cita no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Cita obtenida correctamente",
            data: cita
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener cita",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const cita = await citaService.crear(req.body);

        if (!cita) {
            return res.status(400).json({
                mensaje: "Datos incompletos. Cliente, usuario, servicio, fecha, hora_inicio y hora_fin son obligatorios"
            });
        }

        res.status(201).json({
            mensaje: "Cita creada correctamente",
            data: cita
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear cita",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const id = Number(req.params.id);

        const cita = await citaService.actualizar(id, req.body);

        if (!cita) {
            return res.status(404).json({
                mensaje: "Cita no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Cita actualizada correctamente",
            data: cita
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar cita",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const id = Number(req.params.id);

        const cita = await citaService.eliminar(id);

        if (!cita) {
            return res.status(404).json({
                mensaje: "Cita no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Cita eliminada correctamente",
            data: cita
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar cita",
            error: error.message
        });
    }
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};