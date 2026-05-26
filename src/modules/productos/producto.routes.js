const express = require("express");
const productoController = require("./producto.controller");

const router = express.Router();

router.get("/", productoController.obtenerTodos);
router.get("/:id", productoController.obtenerPorId);
router.post("/", productoController.crear);
router.put("/:id", productoController.actualizar);
router.delete("/:id", productoController.eliminar);

module.exports = router;