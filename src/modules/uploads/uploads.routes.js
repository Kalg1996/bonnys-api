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
    validarLimiteAlmacenamiento,
    validarTamanoMediaGaleria,
    validarDuracionVideo
} = require("./uploads.middleware");

const router = express.Router();

router.post(
    "/productos/imagen",
    uploadImagenProducto,
    validarLimiteAlmacenamiento,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("productos")
);

router.post(
    "/productos/video",
    uploadVideoProducto,
    validarLimiteAlmacenamiento,
    validarDuracionVideo,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("productos")
);

router.post(
    "/servicios/imagen",
    uploadImagenServicio,
    validarLimiteAlmacenamiento,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("servicios")
);

router.post(
    "/servicios/video",
    uploadVideoServicio,
    validarLimiteAlmacenamiento,
    validarDuracionVideo,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("servicios")
);

router.post(
    "/configuracion/logo",
    uploadLogoConfiguracion,
    validarLimiteAlmacenamiento,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("configuracion")
);

router.post(
    "/configuracion/portada",
    uploadPortadaConfiguracion,
    validarLimiteAlmacenamiento,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("configuracion")
);

router.post(
    "/configuracion/favicon",
    uploadFaviconConfiguracion,
    validarLimiteAlmacenamiento,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("configuracion")
);

router.post(
    "/testimonios/foto",
    uploadFotoTestimonio,
    validarLimiteAlmacenamiento,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("testimonios")
);

router.post(
    "/promociones/imagen",
    uploadImagenPromocion,
    validarLimiteAlmacenamiento,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("promociones")
);

router.post(
    "/galeria-trabajos/media",
    uploadMediaGaleriaTrabajo,
    validarLimiteAlmacenamiento,
    validarTamanoMediaGaleria,
    validarDuracionVideo,
    uploadController.manejarErrorUpload,
    uploadController.responderArchivo("galeria-trabajos")
);

module.exports = router;
