const express = require("express");
const configuracionController = require("./configuracionSitio.controller");

const router = express.Router();

router.get("/", configuracionController.obtener);
router.put("/", configuracionController.actualizar);

module.exports = router;
