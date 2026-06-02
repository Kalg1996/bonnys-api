const testimonioService = require("./testimonio.service");

async function obtenerTodos(req, res) {
    try {
        const testimonios = await testimonioService.obtenerTodos();

        res.status(200).json({
            mensaje: "Testimonios obtenidos correctamente",
            data: testimonios
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener testimonios",
            error: error.message
        });
    }
}

async function obtenerPublicos(req, res) {
    try {
        const testimonios = await testimonioService.obtenerPublicos();

        res.status(200).json({
            mensaje: "Testimonios públicos obtenidos correctamente",
            data: testimonios
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener testimonios públicos",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const testimonio = await testimonioService.obtenerPorId(Number(req.params.id));

        if (!testimonio) {
            return res.status(404).json({ mensaje: "Testimonio no encontrado" });
        }

        res.status(200).json({
            mensaje: "Testimonio obtenido correctamente",
            data: testimonio
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener testimonio",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const testimonio = await testimonioService.crear(req.body);

        res.status(201).json({
            mensaje: "Testimonio creado correctamente",
            data: testimonio
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al crear testimonio",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const testimonio = await testimonioService.actualizar(Number(req.params.id), req.body);

        if (!testimonio) {
            return res.status(404).json({ mensaje: "Testimonio no encontrado" });
        }

        res.status(200).json({
            mensaje: "Testimonio actualizado correctamente",
            data: testimonio
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al actualizar testimonio",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const testimonio = await testimonioService.eliminar(Number(req.params.id));

        if (!testimonio) {
            return res.status(404).json({ mensaje: "Testimonio no encontrado" });
        }

        res.status(200).json({
            mensaje: "Testimonio eliminado correctamente",
            data: testimonio
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al eliminar testimonio",
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
