const configuracionRepository = require("./configuracionSitio.repository");
const {
    crearErrorValidacion,
    validarCorreo,
    validarTextoRequerido
} = require("../../utils/validation");

const CAMPOS_COLOR = ["color_principal", "color_secundario", "color_acento"];
const CAMPOS_URL = [
    "logo_url",
    "portada_url",
    "favicon_url",
    "facebook_url",
    "instagram_url",
    "tiktok_url",
    "youtube_url",
    "google_maps_url"
];

function validarHex(valor, campo) {
    if (!valor) return;

    if (!/^#[0-9A-Fa-f]{6}$/.test(valor)) {
        throw crearErrorValidacion(`${campo} debe tener formato hexadecimal`);
    }
}

function validarUrl(valor, campo) {
    if (!valor) return;

    if (
        !String(valor).startsWith("http://") &&
        !String(valor).startsWith("https://") &&
        !String(valor).startsWith("/uploads")
    ) {
        throw crearErrorValidacion(`${campo} debe iniciar con http, https o /uploads`);
    }
}

function validarWhatsapp(valor) {
    if (!valor) return;

    if (!/^[0-9]+$/.test(String(valor))) {
        throw crearErrorValidacion("whatsapp_numero solo debe contener números");
    }
}

function filtrarDatos(datos) {
    return Object.keys(datos).reduce((acc, campo) => {
        if (configuracionRepository.CAMPOS.includes(campo)) {
            acc[campo] = datos[campo] ?? "";
        }

        return acc;
    }, {});
}

function validar(datos) {
    if ("nombre_negocio" in datos) {
        validarTextoRequerido(datos.nombre_negocio, "nombre_negocio");
    }

    CAMPOS_COLOR.forEach((campo) => validarHex(datos[campo], campo));
    CAMPOS_URL.forEach((campo) => validarUrl(datos[campo], campo));
    validarCorreo(datos.correo_contacto);
    validarWhatsapp(datos.whatsapp_numero);
}

async function obtenerConfiguracion() {
    return await configuracionRepository.obtenerOCrear();
}

async function actualizarConfiguracion(datos) {
    const actual = await configuracionRepository.obtenerOCrear();
    const datosFiltrados = filtrarDatos(datos);
    const datosCompletos = {
        ...actual,
        ...datosFiltrados
    };

    validar(datosCompletos);
    await configuracionRepository.actualizar(actual.id_configuracion, datosFiltrados);

    return await configuracionRepository.obtenerOCrear();
}

module.exports = {
    obtenerConfiguracion,
    actualizarConfiguracion
};
