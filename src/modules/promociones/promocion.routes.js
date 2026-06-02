const express = require("express");
const promocionController = require("./promocion.controller");

const router = express.Router();

router.get("/", promocionController.obtenerTodos);
router.get("/:id", promocionController.obtenerPorId);
router.post("/", promocionController.crear);
router.put("/:id", promocionController.actualizar);
router.delete("/:id", promocionController.eliminar);

module.exports = router;
