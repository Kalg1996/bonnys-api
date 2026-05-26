const express = require("express");
const clienteController = require("./cliente.controller");

const router = express.Router();

router.get("/", clienteController.obtenerTodos);
router.get("/:id", clienteController.obtenerPorId);
router.post("/", clienteController.crear);
router.put("/:id", clienteController.actualizar);
router.delete("/:id", clienteController.eliminar);

module.exports = router;