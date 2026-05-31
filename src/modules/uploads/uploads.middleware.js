const path = require("path");
const multer = require("multer");

const TIPOS = {
    productos: "productos",
    servicios: "servicios"
};

const EXTENSIONES_IMAGEN = [".jpg", ".jpeg", ".png", ".webp"];
const EXTENSIONES_VIDEO = [".mp4", ".webm", ".mov"];
const MAX_IMAGEN = 5 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;

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

module.exports = {
    uploadImagenProducto,
    uploadVideoProducto,
    uploadImagenServicio,
    uploadVideoServicio
};
