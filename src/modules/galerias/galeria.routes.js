const express = require("express");
const galeriaController = require("./galeria.controller");

const router = express.Router();

router.get("/servicios/:idServicio", galeriaController.obtenerGaleriaServicio);
router.post("/servicios/:idServicio", galeriaController.agregarMediaServicio);
router.delete("/servicios/:idMedia", galeriaController.eliminarMediaServicio);

router.get("/productos/:idProducto", galeriaController.obtenerGaleriaProducto);
router.post("/productos/:idProducto", galeriaController.agregarMediaProducto);
router.delete("/productos/:idMedia", galeriaController.eliminarMediaProducto);

module.exports = router;
