const express = require("express");
const galeriaTrabajoController = require("./galeriaTrabajo.controller");

const router = express.Router();

router.get("/", galeriaTrabajoController.obtenerTodos);
router.get("/:id", galeriaTrabajoController.obtenerPorId);
router.post("/", galeriaTrabajoController.crear);
router.put("/:id", galeriaTrabajoController.actualizar);
router.delete("/:id", galeriaTrabajoController.eliminar);

module.exports = router;
