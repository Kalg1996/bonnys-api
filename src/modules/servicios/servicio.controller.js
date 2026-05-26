const servicioService = require("./servicio.service");

async function obtenerTodos(req, res) {
    try {
        const servicios = await servicioService.obtenerTodos();

        res.status(200).json({
            mensaje: "Servicios obtenidos correctamente",
            data: servicios
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener servicios",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const id = Number(req.params.id);

        const servicio = await servicioService.obtenerPorId(id);

        if (!servicio) {
            return res.status(404).json({
                mensaje: "Servicio no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Servicio obtenido correctamente",
            data: servicio
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener servicio",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const servicio = await servicioService.crear(req.body);

        if (!servicio) {
            return res.status(400).json({
                mensaje: "Nombre, precio y duración son obligatorios"
            });
        }

        res.status(201).json({
            mensaje: "Servicio creado correctamente",
            data: servicio
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear servicio",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const id = Number(req.params.id);

        const servicio = await servicioService.actualizar(id, req.body);

        if (!servicio) {
            return res.status(404).json({
                mensaje: "Servicio no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Servicio actualizado correctamente",
            data: servicio
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar servicio",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const id = Number(req.params.id);

        const servicio = await servicioService.eliminar(id);

        if (!servicio) {
            return res.status(404).json({
                mensaje: "Servicio no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Servicio eliminado correctamente",
            data: servicio
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar servicio",
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