const express = require("express");
const servicioController = require("./servicio.controller");

const router = express.Router();

router.get("/", servicioController.obtenerTodos);
router.get("/:id", servicioController.obtenerPorId);
router.post("/", servicioController.crear);
router.put("/:id", servicioController.actualizar);
router.delete("/:id", servicioController.eliminar);

module.exports = router;