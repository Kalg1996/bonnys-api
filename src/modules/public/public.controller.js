const publicService = require("./public.service");

async function obtenerServicios(req, res) {
    try {
        const servicios = await publicService.obtenerServicios();

        res.status(200).json({
            mensaje: "Servicios públicos obtenidos correctamente",
            data: servicios
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener servicios públicos",
            error: error.message
        });
    }
}

async function obtenerProductos(req, res) {
    try {
        const productos = await publicService.obtenerProductos();

        res.status(200).json({
            mensaje: "Productos públicos obtenidos correctamente",
            data: productos
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener productos públicos",
            error: error.message
        });
    }
}

async function agendarCita(req, res) {
    try {
        const cita = await publicService.agendarCita(req.body);

        if (!cita) {
            return res.status(400).json({
                mensaje: "Datos incompletos para agendar la cita"
            });
        }

        res.status(201).json({
            mensaje: "Cita agendada correctamente",
            data: cita
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al agendar cita",
            error: error.message
        });
    }
}

module.exports = {
    obtenerServicios,
    obtenerProductos,
    agendarCita
};
