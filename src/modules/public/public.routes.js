const express = require("express");
const publicController = require("./public.controller");

const router = express.Router();

router.get("/servicios", publicController.obtenerServicios);
router.get("/disponibilidad", publicController.obtenerDisponibilidad);
router.get("/servicios/:id/galeria", publicController.obtenerGaleriaServicio);
router.get("/productos", publicController.obtenerProductos);
router.get("/productos/:id/galeria", publicController.obtenerGaleriaProducto);
router.post("/citas", publicController.agendarCita);

module.exports = router;
