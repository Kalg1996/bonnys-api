const express = require("express");
const uploadController = require("./uploads.controller");
const {
    uploadImagenProducto,
    uploadVideoProducto,
    uploadImagenServicio,
    uploadVideoServicio,
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

module.exports = router;
