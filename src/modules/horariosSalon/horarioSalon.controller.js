const horarioSalonService = require("./horarioSalon.service");

async function obtenerTodos(req, res) {
    try {
        const horarios = await horarioSalonService.obtenerTodos();

        res.status(200).json({
            mensaje: "Horarios del salón obtenidos correctamente",
            data: horarios
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener horarios del salón",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const horario = await horarioSalonService.obtenerPorId(req.params.id);

        if (!horario) {
            return res.status(404).json({
                mensaje: "Horario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Horario del salón obtenido correctamente",
            data: horario
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener horario del salón",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const horario = await horarioSalonService.actualizar(req.params.id, req.body);

        if (!horario) {
            return res.status(404).json({
                mensaje: "Horario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Horario del salón actualizado correctamente",
            data: horario
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al actualizar horario del salón",
            error: error.message
        });
    }
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    actualizar
};
