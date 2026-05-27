const express = require("express");
const gastoController = require("./gasto.controller");

const router = express.Router();

router.get("/", gastoController.obtenerTodos);
router.get("/:id", gastoController.obtenerPorId);
router.post("/", gastoController.crear);
router.put("/:id", gastoController.actualizar);
router.delete("/:id", gastoController.eliminar);

module.exports = router;