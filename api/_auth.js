const crypto = require("crypto");

const DURACION_TOKEN_MS = 12 * 60 * 60 * 1000; // 12 horas

function firmar(payload) {
  return crypto
    .createHmac("sha256", process.env.ADMIN_SECRET)
    .update(payload)
    .digest("hex");
}

function emitirToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + DURACION_TOKEN_MS })
  ).toString("base64url");
  return `${payload}.${firmar(payload)}`;
}

function tokenValido(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, firma] = token.split(".");
  const firmaEsperada = firmar(payload);
  const a = Buffer.from(firma || "");
  const b = Buffer.from(firmaEsperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const datos = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof datos.exp === "number" && datos.exp > Date.now();
  } catch {
    return false;
  }
}

function credencialesValidas(usuario, clave) {
  const usuarioEsperado = process.env.ADMIN_USUARIO || "";
  const claveEsperada = process.env.ADMIN_CLAVE || "";
  const a = Buffer.from(String(usuario || ""));
  const b = Buffer.from(usuarioEsperado);
  const c = Buffer.from(String(clave || ""));
  const d = Buffer.from(claveEsperada);
  const usuarioOk = a.length === b.length && crypto.timingSafeEqual(a, b);
  const claveOk = c.length === d.length && crypto.timingSafeEqual(c, d);
  return usuarioOk && claveOk;
}

function requiereAdmin(req, res) {
  const encabezado = req.headers.authorization || "";
  const token = encabezado.startsWith("Bearer ") ? encabezado.slice(7) : "";
  if (!tokenValido(token)) {
    res.status(401).json({ error: "No autorizado" });
    return false;
  }
  return true;
}

module.exports = { emitirToken, tokenValido, credencialesValidas, requiereAdmin };
