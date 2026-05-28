const authService = require("./auth.service");

async function login(req, res) {
    try {
        const { nombre_usuario, password } = req.body;

        const resultado = await authService.login(nombre_usuario, password);

        if (!resultado) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

        res.status(200).json({
            mensaje: "Login correcto",
            data: resultado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al iniciar sesión",
            error: error.message
        });
    }
}

module.exports = {
    login
};