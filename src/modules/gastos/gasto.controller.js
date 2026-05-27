const gastoService = require("./gasto.service");

async function obtenerTodos(req, res) {
    try {
        const gastos = await gastoService.obtenerTodos();

        res.status(200).json({
            mensaje: "Gastos obtenidos correctamente",
            data: gastos
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener gastos",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const id = Number(req.params.id);

        const gasto = await gastoService.obtenerPorId(id);

        if (!gasto) {
            return res.status(404).json({
                mensaje: "Gasto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Gasto obtenido correctamente",
            data: gasto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener gasto",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const gasto = await gastoService.crear(req.body);

        if (!gasto) {
            return res.status(400).json({
                mensaje: "categoria, concepto, monto y metodo_pago son obligatorios"
            });
        }

        res.status(201).json({
            mensaje: "Gasto creado correctamente",
            data: gasto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear gasto",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const id = Number(req.params.id);

        const gasto = await gastoService.actualizar(id, req.body);

        if (!gasto) {
            return res.status(404).json({
                mensaje: "Gasto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Gasto actualizado correctamente",
            data: gasto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar gasto",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const id = Number(req.params.id);

        const gasto = await gastoService.eliminar(id);

        if (!gasto) {
            return res.status(404).json({
                mensaje: "Gasto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Gasto eliminado correctamente",
            data: gasto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar gasto",
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