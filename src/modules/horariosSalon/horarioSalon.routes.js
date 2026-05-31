const express = require("express");
const horarioSalonController = require("./horarioSalon.controller");

const router = express.Router();

router.get("/", horarioSalonController.obtenerTodos);
router.get("/:id", horarioSalonController.obtenerPorId);
router.put("/:id", horarioSalonController.actualizar);

module.exports = router;
