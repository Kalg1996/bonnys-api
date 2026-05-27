const express = require("express");
const ingresoController = require("./ingreso.controller");

const router = express.Router();

router.get("/", ingresoController.obtenerTodos);
router.get("/:id", ingresoController.obtenerPorId);
router.post("/", ingresoController.crear);
router.put("/:id", ingresoController.actualizar);
router.delete("/:id", ingresoController.eliminar);

module.exports = router;