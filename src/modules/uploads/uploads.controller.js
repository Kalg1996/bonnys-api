const multer = require("multer");
const uploadService = require("./uploads.service");

function responderArchivo(tipo) {
    return (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                mensaje: "Archivo no proporcionado"
            });
        }

        return res.status(201).json({
            mensaje: "Archivo subido correctamente",
            data: {
                url: uploadService.construirUrl(tipo, req.file)
            }
        });
    };
}

function manejarErrorUpload(error, req, res, next) {
    if (!error) {
        return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            mensaje: "El archivo excede el tamaño máximo permitido"
        });
    }

    return res.status(400).json({
        mensaje: error.message || "No se pudo subir el archivo"
    });
}

module.exports = {
    responderArchivo,
    manejarErrorUpload
};
