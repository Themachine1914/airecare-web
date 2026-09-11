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
| `airecare_solicitudes` | Leads del formulario público (nombre, teléfono, plan, nota, fecha). |
| `airecare_proyectos` | Proyectos de clientes: estado (abierto/cerrado), plan activado, precio de venta, costo de materiales, costo de mano de obra y recordatorio de seguimiento. |
| `airecare_sesion` (sessionStorage) | Sesión del admin en la pestaña actual. |

El botón **«Restaurar datos originales»** en el admin vuelve a cargar los 5 planes iniciales. Para reiniciar todo, borra las claves del sitio en las herramientas de desarrollador del navegador.

## Notas

- Portada y admin leen la **misma fuente de datos**: cualquier cambio en el admin se refleja al instante en la portada.
- Todos los planes son **suscripción mensual** e incluyen **2 o 3 mantenimientos al año según necesidad** (el campo es editable por plan en el admin).
- El formulario público **no envía email**: guarda la solicitud en localStorage para verla en el admin.
