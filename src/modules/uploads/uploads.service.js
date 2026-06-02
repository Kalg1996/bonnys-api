const path = require("path");

const CARPETAS = {
    productos: "productos",
    servicios: "servicios",
    configuracion: "configuracion"
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
