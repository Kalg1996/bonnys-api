const clienteService = require("./cliente.service");

async function obtenerTodos(req, res) {
    try {
        const clientes = await clienteService.obtenerTodos();

        res.status(200).json({
            mensaje: "Clientes obtenidos correctamente",
            data: clientes
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener clientes",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const id = Number(req.params.id);

        const cliente = await clienteService.obtenerPorId(id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Cliente obtenido correctamente",
            data: cliente
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener cliente",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const cliente = await clienteService.crear(req.body);

        if (!cliente) {
            return res.status(400).json({
                mensaje: "Datos incompletos. Nombre y apellido son obligatorios"
            });
        }

        res.status(201).json({
            mensaje: "Cliente creado correctamente",
            data: cliente
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear cliente",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const id = Number(req.params.id);

        const cliente = await clienteService.actualizar(id, req.body);

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado o id inválido"
            });
        }

        res.status(200).json({
            mensaje: "Cliente actualizado correctamente",
            data: cliente
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar cliente",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const id = Number(req.params.id);

        const cliente = await clienteService.eliminar(id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado o id inválido"
            });
        }

        res.status(200).json({
            mensaje: "Cliente eliminado correctamente",
            data: cliente
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar cliente",
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