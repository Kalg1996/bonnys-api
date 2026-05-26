const usuarioService = require("./usuario.service");

async function obtenerTodos(req, res) {
    try {
        const usuarios = await usuarioService.obtenerTodos();

        res.status(200).json({
            mensaje: "Usuarios obtenidos correctamente",
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener usuarios",
            error: error.message
        });
    }
}

async function obtenerPorId(req, res) {
    try {
        const id = Number(req.params.id);

        const usuario = await usuarioService.obtenerPorId(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Usuario obtenido correctamente",
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener usuario",
            error: error.message
        });
    }
}

async function crear(req, res) {
    try {
        const usuario = await usuarioService.crear(req.body);

        if (!usuario) {
            return res.status(400).json({
                mensaje: "Datos incompletos. Nombre, apellido, nombre_usuario, password y rol son obligatorios"
            });
        }

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear usuario",
            error: error.message
        });
    }
}

async function actualizar(req, res) {
    try {
        const id = Number(req.params.id);

        const usuario = await usuarioService.actualizar(id, req.body);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado o id inválido"
            });
        }

        res.status(200).json({
            mensaje: "Usuario actualizado correctamente",
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar usuario",
            error: error.message
        });
    }
}

async function eliminar(req, res) {
    try {
        const id = Number(req.params.id);

        const usuario = await usuarioService.eliminar(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado o id inválido"
            });
        }

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente",
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar usuario",
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