const pool = require("../../config/db");

const CAMPOS = [
    "nombre_negocio",
    "logo_url",
    "portada_url",
    "favicon_url",
    "color_principal",
    "color_secundario",
    "color_acento",
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

async function obtenerPrimera() {
    const [rows] = await pool.query(
        "SELECT * FROM configuracion_sitio ORDER BY id_configuracion ASC LIMIT 1"
    );

    return rows[0] || null;
}

async function crearDefault() {
    const columnas = CAMPOS.join(", ");
    const placeholders = CAMPOS.map(() => "?").join(", ");
    const valores = CAMPOS.map((campo) => CONFIG_DEFAULT[campo]);
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
    const campos = Object.keys(datos).filter((campo) => CAMPOS.includes(campo));

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
    obtenerOCrear,
    actualizar
};
