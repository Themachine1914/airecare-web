const { db } = require("./_db");
const { requiereAdmin } = require("./_auth");

function aCamelCase(fila) {
  return {
    id: fila.id,
    cliente: fila.cliente,
    telefono: fila.telefono,
    planId: fila.plan_id,
    precioVenta: Number(fila.precio_venta),
    costoMateriales: Number(fila.costo_materiales),
    costoManoObra: Number(fila.costo_mano_obra),
    recordatorioFecha: fila.recordatorio_fecha,
    recordatorioNota: fila.recordatorio_nota,
    notas: fila.notas,
    estado: fila.estado,
    cobros: fila.cobros || [],
    fechaCreacion: fila.fecha_creacion,
    fechaAprobacion: fila.fecha_aprobacion,
    fechaCierre: fila.fecha_cierre,
  };
}

module.exports = async (req, res) => {
  if (!requiereAdmin(req, res)) return;
  const sql = db();

  if (req.method === "GET") {
    const filas = await sql`select * from proyectos order by fecha_creacion desc`;
    res.status(200).json(filas.map(aCamelCase));
    return;
  }

  if (req.method === "POST") {
    const p = req.body || {};
    if (!p.id || !p.cliente) {
      res.status(400).json({ error: "Datos inválidos" });
      return;
    }
    await sql`
      insert into proyectos
        (id, cliente, telefono, plan_id, precio_venta, costo_materiales, costo_mano_obra,
         recordatorio_fecha, recordatorio_nota, notas, estado, cobros,
         fecha_creacion, fecha_aprobacion, fecha_cierre)
      values
        (${p.id}, ${p.cliente}, ${p.telefono || ""}, ${p.planId || ""},
         ${p.precioVenta || 0}, ${p.costoMateriales || 0}, ${p.costoManoObra || 0},
         ${p.recordatorioFecha || null}, ${p.recordatorioNota || ""}, ${p.notas || ""},
         ${p.estado || "cotizacion"}, ${JSON.stringify(p.cobros || [])},
         ${p.fechaCreacion || new Date().toISOString()}, ${p.fechaAprobacion || null},
         ${p.fechaCierre || null})
    `;
    res.status(201).json({ ok: true });
    return;
  }

  if (req.method === "PUT") {
    const p = req.body || {};
    if (!p.id) {
      res.status(400).json({ error: "Falta id" });
      return;
    }
    await sql`
      update proyectos set
        cliente = ${p.cliente},
        telefono = ${p.telefono || ""},
        plan_id = ${p.planId || ""},
        precio_venta = ${p.precioVenta || 0},
        costo_materiales = ${p.costoMateriales || 0},
        costo_mano_obra = ${p.costoManoObra || 0},
        recordatorio_fecha = ${p.recordatorioFecha || null},
        recordatorio_nota = ${p.recordatorioNota || ""},
        notas = ${p.notas || ""},
        estado = ${p.estado || "cotizacion"},
        cobros = ${JSON.stringify(p.cobros || [])},
        fecha_aprobacion = ${p.fechaAprobacion || null},
        fecha_cierre = ${p.fechaCierre || null}
      where id = ${p.id}
    `;
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) {
      res.status(400).json({ error: "Falta id" });
      return;
    }
    await sql`delete from proyectos where id = ${id}`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Método no permitido" });
};
