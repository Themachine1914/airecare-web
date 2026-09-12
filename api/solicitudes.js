const { db } = require("./_db");
const { requiereAdmin } = require("./_auth");

function aCamelCase(fila) {
  return {
    id: fila.id,
    fecha: fila.fecha,
    nombre: fila.nombre,
    telefono: fila.telefono,
    ubicacion: fila.ubicacion,
    mapaUrl: fila.mapa_url,
    lat: fila.lat,
    lng: fila.lng,
    planId: fila.plan_id,
    planNombre: fila.plan_nombre,
    nota: fila.nota,
  };
}

module.exports = async (req, res) => {
  const sql = db();

  if (req.method === "GET") {
    if (!requiereAdmin(req, res)) return;
    const filas = await sql`select * from solicitudes order by fecha desc`;
    res.status(200).json(filas.map(aCamelCase));
    return;
  }

  if (req.method === "POST") {
    const s = req.body || {};
    if (!s.id || !s.nombre || !s.telefono) {
      res.status(400).json({ error: "Datos inválidos" });
      return;
    }
    await sql`
      insert into solicitudes
        (id, fecha, nombre, telefono, ubicacion, mapa_url, lat, lng, plan_id, plan_nombre, nota)
      values
        (${s.id}, ${s.fecha || new Date().toISOString()}, ${s.nombre}, ${s.telefono},
         ${s.ubicacion || ""}, ${s.mapaUrl || ""}, ${s.lat || ""}, ${s.lng || ""},
         ${s.planId || ""}, ${s.planNombre || ""}, ${s.nota || ""})
      on conflict (id) do nothing
    `;
    res.status(201).json({ ok: true });
    return;
  }

  if (req.method === "DELETE") {
    if (!requiereAdmin(req, res)) return;
    await sql`delete from solicitudes`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Método no permitido" });
};
