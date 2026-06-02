const express = require("express");
const almacenamientoController = require("./almacenamiento.controller");

const router = express.Router();

router.get("/resumen", almacenamientoController.obtenerResumen);
router.get("/archivos-no-usados", almacenamientoController.obtenerArchivosNoUsados);
router.delete("/archivos-no-usados", almacenamientoController.eliminarArchivosNoUsados);

module.exports = router;
