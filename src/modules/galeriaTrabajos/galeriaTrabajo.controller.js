const galeriaTrabajoService = require("./galeriaTrabajo.service");

async function obtenerTodos(req, res) {
    try {
        const trabajos = await galeriaTrabajoService.obtenerTodos();

        res.status(200).json({
            mensaje: "Galería de trabajos obtenida correctamente",
            data: trabajos
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener galería de trabajos",
            error: error.message
        });
    }
}

async function obtenerPublicos(req, res) {
    try {
        const trabajos = await galeriaTrabajoService.obtenerPublicos();

        res.status(200).json({
            mensaje: "Galería pública de trabajos obtenida correctamente",
            data: trabajos
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener galería pública de trabajos",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const trabajo = await galeriaTrabajoService.obtenerPorId(Number(req.params.id));

        if (!trabajo) {
            return res.status(404).json({ mensaje: "Trabajo no encontrado" });
        }

        res.status(200).json({
            mensaje: "Trabajo obtenido correctamente",
            data: trabajo
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener trabajo",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const trabajo = await galeriaTrabajoService.crear(req.body);

        res.status(201).json({
            mensaje: "Trabajo creado correctamente",
            data: trabajo
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al crear trabajo",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const trabajo = await galeriaTrabajoService.actualizar(Number(req.params.id), req.body);

        if (!trabajo) {
            return res.status(404).json({ mensaje: "Trabajo no encontrado" });
        }

        res.status(200).json({
            mensaje: "Trabajo actualizado correctamente",
            data: trabajo
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al actualizar trabajo",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const trabajo = await galeriaTrabajoService.eliminar(Number(req.params.id));

        if (!trabajo) {
            return res.status(404).json({ mensaje: "Trabajo no encontrado" });
        }

        res.status(200).json({
            mensaje: "Trabajo eliminado correctamente",
            data: trabajo
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al eliminar trabajo",
            error: error.message
        });
    }
}

module.exports = {
    obtenerTodos,
    obtenerPublicos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
