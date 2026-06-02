const almacenamientoService = require("./almacenamiento.service");

async function obtenerResumen(req, res) {
    try {
        const resumen = await almacenamientoService.obtenerResumen();

        res.status(200).json({
            mensaje: "Resumen de almacenamiento obtenido correctamente",
            data: resumen
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener resumen de almacenamiento",
            error: error.message
        });
    }
}

async function obtenerArchivosNoUsados(req, res) {
    try {
        const resultado = await almacenamientoService.obtenerArchivosNoUsados();

        res.status(200).json({
            mensaje: "Archivos no usados obtenidos correctamente",
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener archivos no usados",
            error: error.message
        });
    }
}

async function eliminarArchivosNoUsados(req, res) {
    try {
        const resultado = await almacenamientoService.eliminarArchivosNoUsados();

        res.status(200).json({
            mensaje: "Archivos no usados eliminados correctamente",
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar archivos no usados",
            error: error.message
        });
    }
}

module.exports = {
    obtenerResumen,
    obtenerArchivosNoUsados,
    eliminarArchivosNoUsados
};
