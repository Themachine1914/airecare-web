# Almanzar Multiservicios — Demo web (AireCare)

Demo de una empresa de mantenimiento de aires acondicionados: página pública con planes + panel de administración. Todo en **un solo `index.html`** (HTML + CSS + JS vanilla), sin dependencias ni paso de build. Logos en `assets/`.

## Cómo correrlo

```bash
cd airecare-demo
npm run dev
```

y abre **http://localhost:3000** (el servidor es `servidor.js`, hecho solo con Node — sin instalar dependencias).

**Otras formas:** doble clic en `index.html` (funciona sin servidor), o `npx serve .`, o `python3 -m http.server 8080`.

## Acceso a administración

- Desde el enlace **«Acceso admin»** en el pie de página, o abre directamente `#/admin` (ej. `http://localhost:8080/#/admin`).
- **Usuario:** `admin` · **Contraseña:** `airecare` (se muestran en la propia pantalla de login).

## Qué se guarda en localStorage

| Clave | Contenido |
|---|---|
| `airecare_datos` | Nombre comercial de la empresa y los planes (creados/editados en el admin). |
| `airecare_solicitudes` | Leads del formulario público (nombre, teléfono, ubicación, plan, nota, fecha). Se envían también por WhatsApp al `+1 829 637 2748`. |
| `airecare_proyectos` | Cotizaciones y proyectos: estado (`cotizacion` / `aprobado` / `cerrado`), plan, monto por cobrar, inversión (materiales + mano de obra), cobros con fecha y recordatorio de seguimiento. Los proyectos antiguos con estado `abierto` se migran a `cotizacion` al cargar. |
| `airecare_sesion` (sessionStorage) | Sesión del admin en la pestaña actual. |

### Flujo de proyectos (admin)

1. **Crear cotización** — cliente, plan, monto por cobrar e inversión.
2. **Aprobar** — pasa a proyecto aprobado; entra en el resumen económico.
3. **Registrar cobros** — monto + fecha de cobro (pueden ser parciales).
4. **Resumen económico (suma de todos los proyectos)** — total cotizado, total aprobado, total por invertir, total por cobrar, total cobrado y ganancias estimadas.

El botón **«Restaurar datos originales»** en el admin vuelve a cargar los 5 planes iniciales. Para reiniciar todo, borra las claves del sitio en las herramientas de desarrollador del navegador.

## Notas

- Portada y admin leen la **misma fuente de datos**: cualquier cambio en el admin se refleja al instante en la portada.
- Todos los planes son **suscripción mensual** e incluyen **2 o 3 mantenimientos al año según necesidad** (el campo es editable por plan en el admin).
- El formulario público **abre WhatsApp** con los datos y también guarda la solicitud en localStorage para verla en el admin.
