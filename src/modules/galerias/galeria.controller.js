const galeriaService = require("./galeria.service");

async function obtenerGaleriaServicio(req, res) {
    try {
        const galeria = await galeriaService.obtenerGaleriaServicio(req.params.idServicio);

        res.status(200).json({
            mensaje: "Galería de servicio obtenida correctamente",
            data: galeria
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener galería de servicio",
            error: error.message
        });
    }
}

async function agregarMediaServicio(req, res) {
    try {
        const media = await galeriaService.agregarMediaServicio(
            req.params.idServicio,
            req.body
        );

        res.status(201).json({
            mensaje: "Media de servicio agregada correctamente",
            data: media
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al agregar media de servicio",
            error: error.message
        });
    }
}

async function eliminarMediaServicio(req, res) {
    try {
        const eliminado = await galeriaService.eliminarMediaServicio(req.params.idMedia);

        if (!eliminado) {
            return res.status(404).json({
                mensaje: "Media de servicio no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Media de servicio eliminada correctamente"
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al eliminar media de servicio",
            error: error.message
        });
    }
}

async function obtenerGaleriaProducto(req, res) {
    try {
        const galeria = await galeriaService.obtenerGaleriaProducto(req.params.idProducto);

        res.status(200).json({
            mensaje: "Galería de producto obtenida correctamente",
            data: galeria
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al obtener galería de producto",
            error: error.message
        });
    }
}

async function agregarMediaProducto(req, res) {
    try {
        const media = await galeriaService.agregarMediaProducto(
            req.params.idProducto,
            req.body
        );

        res.status(201).json({
            mensaje: "Media de producto agregada correctamente",
            data: media
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al agregar media de producto",
            error: error.message
        });
    }
}

async function eliminarMediaProducto(req, res) {
    try {
        const eliminado = await galeriaService.eliminarMediaProducto(req.params.idMedia);

        if (!eliminado) {
            return res.status(404).json({
                mensaje: "Media de producto no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Media de producto eliminada correctamente"
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            mensaje: error.statusCode ? error.message : "Error al eliminar media de producto",
            error: error.message
        });
    }
}

module.exports = {
    obtenerGaleriaServicio,
    agregarMediaServicio,
    eliminarMediaServicio,
    obtenerGaleriaProducto,
    agregarMediaProducto,
    eliminarMediaProducto
};
