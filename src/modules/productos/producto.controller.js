const productoService = require("./producto.service");

async function obtenerTodos(req, res) {
    try {
        const productos = await productoService.obtenerTodos();

        res.status(200).json({
            mensaje: "Productos obtenidos correctamente",
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener productos",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const id = Number(req.params.id);

        const producto = await productoService.obtenerPorId(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto obtenido correctamente",
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener producto",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const producto = await productoService.crear(req.body);

        if (!producto) {
            return res.status(400).json({
                mensaje: "Nombre y precio_venta son obligatorios"
            });
        }

        res.status(201).json({
            mensaje: "Producto creado correctamente",
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear producto",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const id = Number(req.params.id);

        const producto = await productoService.actualizar(id, req.body);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar producto",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const id = Number(req.params.id);

        const producto = await productoService.eliminar(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto eliminado correctamente",
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar producto",
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