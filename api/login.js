const { emitirToken, credencialesValidas } = require("./_auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const { usuario, clave } = req.body || {};
  if (!credencialesValidas(usuario, clave)) {
    res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    return;
  }

  res.status(200).json({ token: emitirToken() });
};
