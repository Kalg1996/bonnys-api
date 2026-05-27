const express = require("express");
const citaController = require("./cita.controller");

const router = express.Router();

router.get("/", citaController.obtenerTodos);
router.get("/:id", citaController.obtenerPorId);
router.post("/", citaController.crear);
router.put("/:id", citaController.actualizar);
router.delete("/:id", citaController.eliminar);

module.exports = router;