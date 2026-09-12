# Almanzar Multiservicios — AireCare

Sitio de una empresa de mantenimiento de aires acondicionados: página
pública con planes + panel de administración con CRM de solicitudes y
proyectos. Frontend en un solo `index.html` (HTML + CSS + JS vanilla, sin
build), backend como Vercel Functions en `api/` con base de datos Postgres
(Neon, vía Vercel Marketplace).

## Arquitectura

- `index.html` — toda la UI (portada pública + panel de admin) y la lógica
  del cliente.
- `api/empresa.js` — `GET` público (nombre + planes), `PUT` de admin.
- `api/solicitudes.js` — `POST` público (formulario de contacto), `GET`/`DELETE` de admin.
- `api/proyectos.js` — CRUD de admin para el seguimiento de proyectos/clientes.
- `api/login.js` — valida usuario/contraseña contra variables de entorno y
  devuelve un token firmado (HMAC) válido por 12 horas.
- Base de datos: 3 tablas (`empresa`, `solicitudes`, `proyectos`) en Neon
  Postgres, conectadas al proyecto de Vercel.

## Variables de entorno (Vercel)

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Inyectada automáticamente por la integración de Neon. |
| `ADMIN_USUARIO` | Usuario para entrar al panel de admin. |
| `ADMIN_CLAVE` | Contraseña del panel de admin. |
| `ADMIN_SECRET` | Clave para firmar los tokens de sesión del admin. |

## Cómo correrlo localmente

El stack completo (con API y base de datos) requiere el CLI de Vercel:

```bash
vercel env pull .env.local   # trae las variables del proyecto en Vercel
vercel dev
```

y abre **http://localhost:3000**.

Si solo necesitas ver la portada estática (sin `/api`, sin login funcional):

```bash
npm run dev
```

(usa `servidor.js`, un servidor Node sin dependencias que solo sirve archivos).

## Acceso a administración

Desde el enlace **«Acceso admin»** en el pie de página, o abre directamente
`#/admin`. Las credenciales están en las variables de entorno del proyecto
en Vercel (`ADMIN_USUARIO` / `ADMIN_CLAVE`), no en el código.

### Flujo de proyectos (admin)

1. **Crear cotización** — cliente, plan, monto por cobrar e inversión.
2. **Aprobar** — pasa a proyecto aprobado; entra en el resumen económico.
3. **Registrar cobros** — monto + fecha de cobro (pueden ser parciales).
4. **Resumen económico (suma de todos los proyectos)** — total cotizado, total aprobado, total por invertir, total por cobrar, total cobrado y ganancias estimadas.

El botón **«Restaurar datos originales»** en el admin vuelve a cargar los 5 planes iniciales de fábrica en el servidor.

## Notas

- Portada y admin leen la **misma fuente de datos** desde el servidor:
  cualquier cambio en el admin se refleja en la portada, y cualquier
  solicitud enviada desde el celular de un cliente aparece en el panel de
  admin sin importar desde qué dispositivo se abra.
- Todos los planes son **suscripción mensual** e incluyen **2 o 3
  mantenimientos al año según necesidad** (editable por plan en el admin).
- El formulario público **abre WhatsApp** con los datos de la solicitud y
  también la guarda en la base de datos para verla en el admin.
- Los proyectos pasan por tres estados: `cotizacion` → `aprobado` → `cerrado`,
  con una lista de `cobros` (monto + fecha + nota) para pagos parciales.
- Desde cada proyecto se puede descargar un **PDF de cotización** (con logo,
  plan y monto) y desde cada cobro un **recibo de pago informal** en PDF —
  se generan en el navegador con jsPDF, sin pasar por el servidor.
