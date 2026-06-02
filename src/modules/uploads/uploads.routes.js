const express = require("express");
const uploadController = require("./uploads.controller");
const {
    uploadImagenProducto,
    uploadVideoProducto,
    uploadImagenServicio,
    uploadVideoServicio,
    uploadLogoConfiguracion,
    uploadPortadaConfiguracion,
    uploadFaviconConfiguracion,
    uploadFotoTestimonio,
    uploadImagenPromocion,
    uploadMediaGaleriaTrabajo,
    validarTamanoMediaGaleria,
    validarDuracionVideo
} = require("./uploads.middleware");

const router = express.Router();

router.post(
    "/productos/imagen",
    uploadImagenProducto,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("productos")
);

router.post(
    "/productos/video",
    uploadVideoProducto,
    validarDuracionVideo,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("productos")
);

router.post(
    "/servicios/imagen",
    uploadImagenServicio,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("servicios")
);

router.post(
    "/servicios/video",
    uploadVideoServicio,
    validarDuracionVideo,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("servicios")
);

router.post(
    "/configuracion/logo",
    uploadLogoConfiguracion,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("configuracion")
);

router.post(
    "/configuracion/portada",
    uploadPortadaConfiguracion,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("configuracion")
);

router.post(
    "/configuracion/favicon",
    uploadFaviconConfiguracion,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("configuracion")
);

router.post(
    "/testimonios/foto",
    uploadFotoTestimonio,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("testimonios")
);

router.post(
    "/promociones/imagen",
    uploadImagenPromocion,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("promociones")
);

router.post(
    "/galeria-trabajos/media",
    uploadMediaGaleriaTrabajo,
    validarTamanoMediaGaleria,
    validarDuracionVideo,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("galeria-trabajos")
);

module.exports = router;
