const express = require("express");
const pool = require("./config/db");
const clienteRoutes = require("./modules/clientes/cliente.routes");
const usuarioRoutes = require("./modules/usuarios/usuario.routes");
const servicioRoutes = require("./modules/servicios/servicio.routes");
const productoRoutes = require("./modules/productos/producto.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Bonnys funcionando correctamente"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT NOW() AS fecha_actual");

        res.json({
            mensaje: "Conexión a MySQL correcta",
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al conectar con MySQL",
            error: error.message
        });
    }
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/productos", productoRoutes);

module.exports = app;