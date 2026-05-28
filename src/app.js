const express = require("express");
const pool = require("./config/db");
const clienteRoutes = require("./modules/clientes/cliente.routes");
const usuarioRoutes = require("./modules/usuarios/usuario.routes");
const servicioRoutes = require("./modules/servicios/servicio.routes");
const productoRoutes = require("./modules/productos/producto.routes");
const citaRoutes = require("./modules/citas/cita.routes");
const ingresoRoutes = require("./modules/ingresos/ingreso.routes");
const gastoRoutes = require("./modules/gastos/gasto.routes");
const authRoutes = require("./modules/auth/auth.routes");
const { verificarToken } = require("./middlewares/auth.middleware");

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
app.use("/api/usuarios", verificarToken, usuarioRoutes);
app.use("/api/clientes", verificarToken, clienteRoutes);
app.use("/api/servicios", verificarToken, servicioRoutes);
app.use("/api/productos", verificarToken, productoRoutes);
app.use("/api/citas", verificarToken, citaRoutes);
app.use("/api/ingresos", verificarToken, ingresoRoutes);
app.use("/api/gastos", verificarToken, gastoRoutes);
app.use("/api/auth", authRoutes);
module.exports = app;