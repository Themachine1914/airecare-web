const { db } = require("./_db");
const { requiereAdmin } = require("./_auth");

module.exports = async (req, res) => {
  const sql = db();

  if (req.method === "GET") {
    const filas = await sql`select nombre, planes from empresa where id = 1`;
    if (!filas.length) {
      res.status(200).json(null);
      return;
    }
    res.status(200).json({ empresa: filas[0].nombre, planes: filas[0].planes });
    return;
  }

  if (req.method === "PUT") {
    if (!requiereAdmin(req, res)) return;
    const { empresa, planes } = req.body || {};
    if (typeof empresa !== "string" || !Array.isArray(planes)) {
      res.status(400).json({ error: "Datos inválidos" });
      return;
    }
    await sql`
      insert into empresa (id, nombre, planes, actualizado_en)
      values (1, ${empresa}, ${JSON.stringify(planes)}, now())
      on conflict (id) do update set
        nombre = excluded.nombre,
        planes = excluded.planes,
        actualizado_en = now()
    `;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Método no permitido" });
};
