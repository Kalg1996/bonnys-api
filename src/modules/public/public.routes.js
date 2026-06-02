const express = require("express");
const publicController = require("./public.controller");
const configuracionController = require("../configuracionSitio/configuracionSitio.controller");
const testimonioController = require("../testimonios/testimonio.controller");
const promocionController = require("../promociones/promocion.controller");
const galeriaTrabajoController = require("../galeriaTrabajos/galeriaTrabajo.controller");

const router = express.Router();

router.get("/servicios", publicController.obtenerServicios);
router.get("/configuracion-sitio", configuracionController.obtener);
router.get("/testimonios", testimonioController.obtenerPublicos);
router.get("/promociones", promocionController.obtenerPublicas);
router.get("/galeria-trabajos", galeriaTrabajoController.obtenerPublicos);
router.get("/disponibilidad", publicController.obtenerDisponibilidad);
router.get("/servicios/:id/galeria", publicController.obtenerGaleriaServicio);
router.get("/productos", publicController.obtenerProductos);
router.get("/productos/:id/galeria", publicController.obtenerGaleriaProducto);
router.post("/citas", publicController.agendarCita);

module.exports = router;
