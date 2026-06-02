const path = require("path");

const CARPETAS = {
    productos: "productos",
    servicios: "servicios",
    configuracion: "configuracion",
    testimonios: "testimonios",
    promociones: "promociones",
    "galeria-trabajos": "galeria-trabajos"
};

function obtenerCarpeta(tipo) {
    return CARPETAS[tipo];
}

function construirUrl(tipo, archivo) {
    const carpeta = obtenerCarpeta(tipo);

    return path.posix.join("/uploads", carpeta, archivo.filename);
}

module.exports = {
    construirUrl
};
