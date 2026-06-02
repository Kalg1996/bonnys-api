const promocionService = require("./promocion.service");

async function obtenerTodos(req, res) {
    try {
        const promociones = await promocionService.obtenerTodos();

        res.status(200).json({
            mensaje: "Promociones obtenidas correctamente",
            data: promociones
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener promociones",
            error: error.message
        });
    }
}

async function obtenerPublicas(req, res) {
    try {
        const promociones = await promocionService.obtenerPublicas();

        res.status(200).json({
            mensaje: "Promociones públicas obtenidas correctamente",
            data: promociones
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener promociones públicas",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const promocion = await promocionService.obtenerPorId(Number(req.params.id));

        if (!promocion) {
            return res.status(404).json({ mensaje: "Promoción no encontrada" });
        }

        res.status(200).json({
            mensaje: "Promoción obtenida correctamente",
            data: promocion
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener promoción",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const promocion = await promocionService.crear(req.body);

        res.status(201).json({
            mensaje: "Promoción creada correctamente",
            data: promocion
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al crear promoción",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const promocion = await promocionService.actualizar(Number(req.params.id), req.body);

        if (!promocion) {
            return res.status(404).json({ mensaje: "Promoción no encontrada" });
        }

        res.status(200).json({
            mensaje: "Promoción actualizada correctamente",
            data: promocion
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al actualizar promoción",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const promocion = await promocionService.eliminar(Number(req.params.id));

        if (!promocion) {
            return res.status(404).json({ mensaje: "Promoción no encontrada" });
        }

        res.status(200).json({
            mensaje: "Promoción eliminada correctamente",
            data: promocion
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al eliminar promoción",
            error: error.message
        });
    }
}

module.exports = {
    obtenerTodos,
    obtenerPublicas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
