const path = require("path");
const fs = require("fs");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffprobeStatic = require("ffprobe-static");
const almacenamientoService = require("../almacenamiento/almacenamiento.service");

ffmpeg.setFfprobePath(ffprobeStatic.path);

const TIPOS = {
    productos: "productos",
    servicios: "servicios",
    configuracion: "configuracion",
    testimonios: "testimonios",
    promociones: "promociones",
    "galeria-trabajos": "galeria-trabajos"
};

const EXTENSIONES_IMAGEN = [".jpg", ".jpeg", ".png", ".webp"];
const EXTENSIONES_VIDEO = [".mp4", ".webm", ".mov"];
const EXTENSIONES_FAVICON = [".ico", ".png", ".svg"];
const MAX_IMAGEN = 5 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;
const MAX_CONFIG_IMAGEN = 2 * 1024 * 1024;
const MAX_PORTADA = 8 * 1024 * 1024;
const MAX_DURACION_VIDEO = 60;

function crearStorage(tipo) {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.join(process.cwd(), "uploads", TIPOS[tipo]));
        },
        filename: (req, file, callback) => {
            const extension = path.extname(file.originalname).toLowerCase();
            const nombreBase = path
                .basename(file.originalname, extension)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
                .slice(0, 40);
            const nombreFinal = `${nombreBase || "archivo"}-${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

            callback(null, nombreFinal);
        }
    });
}

function crearFiltro(extensionesPermitidas) {
    return (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();

        if (!extensionesPermitidas.includes(extension)) {
            return callback(new Error("Tipo de archivo no permitido"));
        }

        callback(null, true);
    };
}

function crearUpload(tipo, extensionesPermitidas, limite) {
    return multer({
        storage: crearStorage(tipo),
        limits: {
            fileSize: limite
        },
        fileFilter: crearFiltro(extensionesPermitidas)
    }).single("archivo");
}

const uploadImagenProducto = crearUpload("productos", EXTENSIONES_IMAGEN, MAX_IMAGEN);
const uploadVideoProducto = crearUpload("productos", EXTENSIONES_VIDEO, MAX_VIDEO);
const uploadImagenServicio = crearUpload("servicios", EXTENSIONES_IMAGEN, MAX_IMAGEN);
const uploadVideoServicio = crearUpload("servicios", EXTENSIONES_VIDEO, MAX_VIDEO);
const uploadLogoConfiguracion = crearUpload("configuracion", EXTENSIONES_IMAGEN, MAX_CONFIG_IMAGEN);
const uploadPortadaConfiguracion = crearUpload("configuracion", EXTENSIONES_IMAGEN, MAX_PORTADA);
const uploadFaviconConfiguracion = crearUpload("configuracion", EXTENSIONES_FAVICON, MAX_CONFIG_IMAGEN);
const uploadFondoConfiguracion = crearUpload("configuracion", EXTENSIONES_IMAGEN, MAX_PORTADA);
const uploadFotoTestimonio = crearUpload("testimonios", EXTENSIONES_IMAGEN, MAX_IMAGEN);
const uploadImagenPromocion = crearUpload("promociones", EXTENSIONES_IMAGEN, MAX_IMAGEN);
const uploadMediaGaleriaTrabajo = crearUpload(
    "galeria-trabajos",
    [...EXTENSIONES_IMAGEN, ...EXTENSIONES_VIDEO],
    MAX_VIDEO
);

function eliminarArchivo(filePath) {
    fs.unlink(filePath, () => {});
}

function obtenerDuracionVideo(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (error, metadata) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(Number(metadata?.format?.duration || 0));
        });
    });
}

async function validarDuracionVideo(req, res, next) {
    if (!req.file) {
        next();
        return;
    }

    const extension = path.extname(req.file.originalname).toLowerCase();

    if (!EXTENSIONES_VIDEO.includes(extension)) {
        next();
        return;
    }

    try {
        const duracion = await obtenerDuracionVideo(req.file.path);

        if (duracion > MAX_DURACION_VIDEO) {
            eliminarArchivo(req.file.path);
            next(new Error("El video no puede durar más de 60 segundos"));
            return;
        }

        next();
    } catch (error) {
        eliminarArchivo(req.file.path);
        next(new Error("No se pudo validar la duración del video"));
    }
}

function validarTamanoMediaGaleria(req, res, next) {
    if (!req.file) {
        next();
        return;
    }

    const extension = path.extname(req.file.originalname).toLowerCase();

    if (EXTENSIONES_IMAGEN.includes(extension) && req.file.size > MAX_IMAGEN) {
        eliminarArchivo(req.file.path);
        next(new Error("La imagen excede el tamaño máximo permitido"));
        return;
    }

    next();
}

async function validarLimiteAlmacenamiento(req, res, next) {
    try {
        await almacenamientoService.validarEspacioDisponible(req.file);
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    uploadImagenProducto,
    uploadVideoProducto,
    uploadImagenServicio,
    uploadVideoServicio,
    uploadLogoConfiguracion,
    uploadPortadaConfiguracion,
    uploadFaviconConfiguracion,
    uploadFondoConfiguracion,
    uploadFotoTestimonio,
    uploadImagenPromocion,
    uploadMediaGaleriaTrabajo,
    validarLimiteAlmacenamiento,
    validarTamanoMediaGaleria,
    validarDuracionVideo
};
