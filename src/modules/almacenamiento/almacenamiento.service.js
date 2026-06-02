const fs = require("fs/promises");
const path = require("path");
const pool = require("../../config/db");

const BYTES_POR_GB = 1024 ** 3;
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const MENSAJE_LIMITE =
    "Has alcanzado el límite de almacenamiento. Elimina archivos no utilizados antes de subir más contenido.";

function obtenerLimiteGb() {
    const limite = Number(process.env.STORAGE_LIMIT_GB || 20);

    return Number.isFinite(limite) && limite > 0 ? limite : 20;
}

function bytesAGb(bytes) {
    return Number((bytes / BYTES_POR_GB).toFixed(2));
}

function bytesAMb(bytes) {
    return Number((bytes / (1024 ** 2)).toFixed(2));
}

function obtenerEstado(porcentajeUso) {
    if (porcentajeUso >= 100) return "LIMITE_ALCANZADO";
    if (porcentajeUso >= 90) return "ALERTA";
    if (porcentajeUso >= 80) return "ADVERTENCIA";

    return "NORMAL";
}

async function asegurarDirectorioUploads() {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

async function listarArchivosFisicos(directorio = UPLOADS_DIR) {
    await asegurarDirectorioUploads();

    const entradas = await fs.readdir(directorio, { withFileTypes: true });
    const archivos = [];

    for (const entrada of entradas) {
        const rutaAbsoluta = path.join(directorio, entrada.name);

        if (entrada.isDirectory()) {
            archivos.push(...await listarArchivosFisicos(rutaAbsoluta));
            continue;
        }

        if (!entrada.isFile()) continue;

        const stat = await fs.stat(rutaAbsoluta);
        const rutaRelativa = path.relative(UPLOADS_DIR, rutaAbsoluta).split(path.sep).join("/");

        archivos.push({
            ruta: `/uploads/${rutaRelativa}`,
            rutaAbsoluta,
            tamanoBytes: stat.size,
            tamanoMb: bytesAMb(stat.size)
        });
    }

    return archivos;
}

async function calcularUsadoBytes() {
    const archivos = await listarArchivosFisicos();

    return archivos.reduce((total, archivo) => total + archivo.tamanoBytes, 0);
}

async function obtenerResumen() {
    const limiteGb = obtenerLimiteGb();
    const limiteBytes = limiteGb * BYTES_POR_GB;
    const usadoBytes = await calcularUsadoBytes();
    const porcentajeUso = limiteBytes > 0
        ? Number(((usadoBytes / limiteBytes) * 100).toFixed(2))
        : 0;

    return {
        limiteGb,
        usadoBytes,
        usadoGb: bytesAGb(usadoBytes),
        disponibleGb: Math.max(0, Number((limiteGb - bytesAGb(usadoBytes)).toFixed(2))),
        porcentajeUso,
        estado: obtenerEstado(porcentajeUso)
    };
}

function normalizarUrlUpload(valor) {
    if (!valor || typeof valor !== "string") return null;

    const indiceUploads = valor.indexOf("/uploads/");

    if (indiceUploads === -1) return null;

    return valor.slice(indiceUploads).split("?")[0].trim();
}

async function obtenerUrlsReferenciadas() {
    const consultas = [
        "SELECT url_foto AS url FROM productos WHERE url_foto IS NOT NULL AND url_foto <> ''",
        "SELECT url_video AS url FROM productos WHERE url_video IS NOT NULL AND url_video <> ''",
        "SELECT url_foto AS url FROM servicios WHERE url_foto IS NOT NULL AND url_foto <> ''",
        "SELECT url_video AS url FROM servicios WHERE url_video IS NOT NULL AND url_video <> ''",
        "SELECT url AS url FROM productos_galeria WHERE url IS NOT NULL AND url <> ''",
        "SELECT url AS url FROM servicios_galeria WHERE url IS NOT NULL AND url <> ''",
        "SELECT url_media AS url FROM galeria_trabajos WHERE url_media IS NOT NULL AND url_media <> ''",
        "SELECT url_imagen AS url FROM promociones WHERE url_imagen IS NOT NULL AND url_imagen <> ''",
        "SELECT url_foto AS url FROM testimonios WHERE url_foto IS NOT NULL AND url_foto <> ''",
        "SELECT logo_url AS url FROM configuracion_sitio WHERE logo_url IS NOT NULL AND logo_url <> ''",
        "SELECT portada_url AS url FROM configuracion_sitio WHERE portada_url IS NOT NULL AND portada_url <> ''",
        "SELECT favicon_url AS url FROM configuracion_sitio WHERE favicon_url IS NOT NULL AND favicon_url <> ''",
        "SELECT fondo_imagen_url AS url FROM configuracion_sitio WHERE fondo_imagen_url IS NOT NULL AND fondo_imagen_url <> ''"
    ];

    const referenciadas = new Set();

    for (const consulta of consultas) {
        let rows = [];

        try {
            [rows] = await pool.query(consulta);
        } catch (error) {
            if (error.code === "ER_BAD_FIELD_ERROR") {
                continue;
            }

            throw error;
        }

        rows.forEach((row) => {
            const urlNormalizada = normalizarUrlUpload(row.url);

            if (urlNormalizada) {
                referenciadas.add(urlNormalizada);
            }
        });
    }

    return referenciadas;
}

async function obtenerArchivosNoUsados() {
    const [archivos, urlsReferenciadas] = await Promise.all([
        listarArchivosFisicos(),
        obtenerUrlsReferenciadas()
    ]);
    const noUsados = archivos.filter((archivo) => !urlsReferenciadas.has(archivo.ruta));
    const totalBytes = noUsados.reduce((total, archivo) => total + archivo.tamanoBytes, 0);

    return {
        cantidad: noUsados.length,
        totalBytes,
        archivos: noUsados.map(({ ruta, tamanoBytes, tamanoMb }) => ({
            ruta,
            tamanoBytes,
            tamanoMb
        }))
    };
}

async function eliminarArchivosNoUsados() {
    const [archivos, urlsReferenciadas] = await Promise.all([
        listarArchivosFisicos(),
        obtenerUrlsReferenciadas()
    ]);
    const noUsados = archivos.filter((archivo) => !urlsReferenciadas.has(archivo.ruta));
    let eliminados = 0;
    let espacioLiberadoBytes = 0;

    for (const archivo of noUsados) {
        const rutaRelativa = path.relative(UPLOADS_DIR, archivo.rutaAbsoluta);

        if (rutaRelativa.startsWith("..") || path.isAbsolute(rutaRelativa)) {
            continue;
        }

        await fs.unlink(archivo.rutaAbsoluta);
        eliminados += 1;
        espacioLiberadoBytes += archivo.tamanoBytes;
    }

    return {
        eliminados,
        espacioLiberadoBytes,
        espacioLiberadoMb: bytesAMb(espacioLiberadoBytes)
    };
}

async function validarEspacioDisponible(archivo) {
    if (!archivo) return;

    const limiteBytes = obtenerLimiteGb() * BYTES_POR_GB;
    const usadoBytes = await calcularUsadoBytes();

    if (usadoBytes > limiteBytes) {
        await fs.unlink(archivo.path).catch(() => {});
        throw new Error(MENSAJE_LIMITE);
    }
}

module.exports = {
    MENSAJE_LIMITE,
    obtenerResumen,
    obtenerArchivosNoUsados,
    eliminarArchivosNoUsados,
    validarEspacioDisponible
};
