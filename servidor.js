/* Servidor estático de desarrollo para el demo AireCare.
   Sin dependencias: solo Node (http/fs/path). Uso: npm run dev */
const http = require("http");
const fs = require("fs");
const path = require("path");

const RAIZ = __dirname;
const PUERTO = process.env.PORT || 3000;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const servidor = http.createServer((req, res) => {
  try {
    let ruta = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (ruta === "/") ruta = "/index.html";

    // Evitar que la ruta salga de la carpeta del proyecto
    const archivo = path.normalize(path.join(RAIZ, ruta));
    if (!archivo.startsWith(RAIZ)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403 — Prohibido");
      return;
    }

    fs.readFile(archivo, (error, contenido) => {
      if (error) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 — Archivo no encontrado");
        return;
      }
      res.writeHead(200, {
        "Content-Type": TIPOS[path.extname(archivo).toLowerCase()] || "application/octet-stream",
      });
      res.end(contenido);
    });
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 — Error del servidor");
  }
});

servidor.listen(PUERTO, () => {
  console.log("\n  AireCare demo listo en:  http://localhost:" + PUERTO);
  console.log("  Administración:          http://localhost:" + PUERTO + "/#/admin");
  console.log("  Credenciales:            admin / airecare");
  console.log("\n  Ctrl+C para detener.\n");
});
