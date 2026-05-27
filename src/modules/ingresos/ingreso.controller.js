const ingresoService = require("./ingreso.service");

async function obtenerTodos(req, res) {
    try {
        const ingresos = await ingresoService.obtenerTodos();

        res.status(200).json({
            mensaje: "Ingresos obtenidos correctamente",
            data: ingresos
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener ingresos",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const id = Number(req.params.id);

        const ingreso = await ingresoService.obtenerPorId(id);

        if (!ingreso) {
            return res.status(404).json({
                mensaje: "Ingreso no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Ingreso obtenido correctamente",
            data: ingreso
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener ingreso",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const ingreso = await ingresoService.crear(req.body);

        if (!ingreso) {
            return res.status(400).json({
                mensaje: "tipo_ingreso, concepto, monto y metodo_pago son obligatorios"
            });
        }

        res.status(201).json({
            mensaje: "Ingreso creado correctamente",
            data: ingreso
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear ingreso",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const id = Number(req.params.id);

        const ingreso = await ingresoService.actualizar(id, req.body);

        if (!ingreso) {
            return res.status(404).json({
                mensaje: "Ingreso no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Ingreso actualizado correctamente",
            data: ingreso
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar ingreso",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const id = Number(req.params.id);

        const ingreso = await ingresoService.eliminar(id);

        if (!ingreso) {
            return res.status(404).json({
                mensaje: "Ingreso no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Ingreso eliminado correctamente",
            data: ingreso
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar ingreso",
            error: error.message
        });
    }
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};