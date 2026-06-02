const configuracionService = require("./configuracionSitio.service");

async function obtener(req, res) {
    try {
        const configuracion = await configuracionService.obtenerConfiguracion();

        res.status(200).json({
            mensaje: "Configuración obtenida correctamente",
            data: configuracion
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener configuración",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const configuracion = await configuracionService.actualizarConfiguracion(req.body);

        res.status(200).json({
            mensaje: "Configuración actualizada correctamente",
            data: configuracion
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al actualizar configuración",
            error: error.message
        });
    }
}

module.exports = {
    obtener,
    actualizar
};
