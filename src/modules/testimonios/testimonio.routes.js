const express = require("express");
const testimonioController = require("./testimonio.controller");

const router = express.Router();

router.get("/", testimonioController.obtenerTodos);
router.get("/:id", testimonioController.obtenerPorId);
router.post("/", testimonioController.crear);
router.put("/:id", testimonioController.actualizar);
router.delete("/:id", testimonioController.eliminar);

module.exports = router;
