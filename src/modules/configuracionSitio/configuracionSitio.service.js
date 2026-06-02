const configuracionRepository = require("./configuracionSitio.repository");
const {
    crearErrorValidacion,
    validarCorreo,
    validarTextoRequerido
} = require("../../utils/validation");

const CAMPOS_COLOR = [
    "color_principal",
    "color_secundario",
    "color_acento",
    "fondo_color_1",
    "fondo_color_2",
    "fondo_color_3"
];
const CAMPOS_URL = [
    "logo_url",
    "portada_url",
    "favicon_url",
    "fondo_imagen_url",
    "facebook_url",
    "instagram_url",
    "tiktok_url",
    "youtube_url",
    "google_maps_url"
];
const FONDOS_PERMITIDOS = ["COLOR", "GRADIENTE", "IMAGEN"];

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

function validarFondoTipo(valor) {
    if (!valor) return;

    if (!FONDOS_PERMITIDOS.includes(valor)) {
        throw crearErrorValidacion("fondo_tipo solo puede ser COLOR, GRADIENTE o IMAGEN");
    }
}

function validarDireccionGradiente(valor) {
    if (!valor) return;

    const direccionValida =
        /^[0-9]{1,3}deg$/.test(String(valor)) ||
        /^to (right|left|top|bottom)( (right|left|top|bottom))?$/.test(String(valor));

    if (!direccionValida) {
        throw crearErrorValidacion("fondo_gradiente_direccion no tiene un formato válido");
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
    validarFondoTipo(datos.fondo_tipo);
    validarDireccionGradiente(datos.fondo_gradiente_direccion);
    validarCorreo(datos.correo_contacto);
    validarWhatsapp(datos.whatsapp_numero);
}

async function obtenerConfiguracion() {
    const configuracion = await configuracionRepository.obtenerOCrear();

    return {
        ...configuracionRepository.CONFIG_DEFAULT,
        ...(configuracion || {})
    };
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

    return await obtenerConfiguracion();
}

module.exports = {
    obtenerConfiguracion,
    actualizarConfiguracion
};
