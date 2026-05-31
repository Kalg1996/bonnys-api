const express = require("express");
const publicController = require("./public.controller");

const router = express.Router();

router.get("/servicios", publicController.obtenerServicios);
router.get("/productos", publicController.obtenerProductos);
router.post("/citas", publicController.agendarCita);

module.exports = router;
