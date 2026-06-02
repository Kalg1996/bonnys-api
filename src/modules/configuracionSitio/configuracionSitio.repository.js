const pool = require("../../config/db");

const CAMPOS = [
    "nombre_negocio",
    "logo_url",
    "portada_url",
    "favicon_url",
    "color_principal",
    "color_secundario",
    "color_acento",
    "fondo_tipo",
    "fondo_color_1",
    "fondo_color_2",
    "fondo_color_3",
    "fondo_imagen_url",
    "fondo_gradiente_direccion",
    "telefono_principal",
    "telefono_secundario",
    "correo_contacto",
    "facebook_url",
    "instagram_url",
    "tiktok_url",
    "youtube_url",
    "whatsapp_numero",
    "whatsapp_mensaje_predeterminado",
    "direccion",
    "google_maps_url",
    "titulo_portada",
    "subtitulo_portada",
    "meta_title",
    "meta_description"
];

const CONFIG_DEFAULT = {
    nombre_negocio: "Bonnys",
    logo_url: "",
    portada_url: "",
    favicon_url: "",
    color_principal: "#B91C1C",
    color_secundario: "#7F1D1D",
    color_acento: "#D97706",
    fondo_tipo: "COLOR",
    fondo_color_1: "#FFF1F2",
    fondo_color_2: "#FEE2E2",
    fondo_color_3: "#FFFFFF",
    fondo_imagen_url: "",
    fondo_gradiente_direccion: "135deg",
    telefono_principal: "",
    telefono_secundario: "",
    correo_contacto: "",
    facebook_url: "",
    instagram_url: "",
    tiktok_url: "",
    youtube_url: "",
    whatsapp_numero: "50200000000",
    whatsapp_mensaje_predeterminado: "Hola, quiero más información sobre los servicios de Bonnys",
    direccion: "",
    google_maps_url: "",
    titulo_portada: "Bonnys",
    subtitulo_portada: "Sistema web para salón de belleza",
    meta_title: "Bonnys",
    meta_description: "Sistema web para salón de belleza"
};

let columnasDisponiblesCache = null;

async function obtenerColumnasDisponibles() {
    if (columnasDisponiblesCache) {
        return columnasDisponiblesCache;
    }

    const [rows] = await pool.query("SHOW COLUMNS FROM configuracion_sitio");
    columnasDisponiblesCache = new Set(rows.map((row) => row.Field));

    return columnasDisponiblesCache;
}

async function filtrarCamposDisponibles(campos) {
    const columnasDisponibles = await obtenerColumnasDisponibles();

    return campos.filter((campo) => columnasDisponibles.has(campo));
}

async function obtenerPrimera() {
    const [rows] = await pool.query(
        "SELECT * FROM configuracion_sitio ORDER BY id_configuracion ASC LIMIT 1"
    );

    return rows[0] || null;
}

async function crearDefault() {
    const camposDisponibles = await filtrarCamposDisponibles(CAMPOS);
    const columnas = camposDisponibles.join(", ");
    const placeholders = camposDisponibles.map(() => "?").join(", ");
    const valores = camposDisponibles.map((campo) => CONFIG_DEFAULT[campo]);
    const [result] = await pool.query(
        `INSERT INTO configuracion_sitio (${columnas}) VALUES (${placeholders})`,
        valores
    );

    return result.insertId;
}

async function obtenerOCrear() {
    let configuracion = await obtenerPrimera();

    if (!configuracion) {
        await crearDefault();
        configuracion = await obtenerPrimera();
    }

    return configuracion;
}

async function actualizar(id, datos) {
    const camposPermitidos = Object.keys(datos).filter((campo) => CAMPOS.includes(campo));
    const campos = await filtrarCamposDisponibles(camposPermitidos);

    if (campos.length === 0) {
        return 0;
    }

    const setSql = campos.map((campo) => `${campo} = ?`).join(", ");
    const valores = campos.map((campo) => datos[campo]);
    valores.push(id);

    const [result] = await pool.query(
        `UPDATE configuracion_sitio SET ${setSql} WHERE id_configuracion = ?`,
        valores
    );

    return result.affectedRows;
}

module.exports = {
    CAMPOS,
    CONFIG_DEFAULT,
    obtenerOCrear,
    actualizar
};
