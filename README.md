# TELEPARK Frontend

Sistema de gestión integral para pacientes con **Enfermedad de Parkinson (EP)** de un centro/taller especializado. Permite administrar el registro, seguimiento médico, evolución, medicación, eventos y obras sociales de cada paciente, consumiendo la API de **Django + Django REST Framework** (desarrollada por equipo separado).

---

## Requisitos previos

- **Node.js** 20.19+ (recomendado 22+) — requisito de Vite 8.x (engines `^20.19.0 || >=22.12.0`)
- **npm** o **yarn**
- Backend Django disponible en la URL indicada por `REACT_APP_API_URL` (por defecto `http://localhost:8080/api/v1`)

## Puesta en marcha

```bash
npm install
npm start
```

La aplicación se sirve en [http://localhost:3000](http://localhost:3000) (o el puerto definido en `PORT`).

## Stack tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18.3.x | UI library (API `createRoot`) |
| Redux Toolkit | 2.12.x | Estado global (slices + `configureStore`) |
| React Router | 6.30.x | Ruteo SPA (`Routes` + `element`) |
| Axios | 1.19.x | HTTP client (con interceptores normalizados) |
| Bootstrap | 5.3.x | CSS framework |
| Reactstrap | 9.2.x | Componentes Bootstrap |
| React Hook Form | 7.86.x | Formularios |
| SweetAlert2 | 11.26.x | Notificaciones y diálogos |
| react-error-boundary | 6.1.x | Error boundaries (global, ruta, inline) |
| Vite | 8.x | Build tool (dev server + build de producción) |
| ESLint + Prettier | 8.x / 3.x | Calidad de código y formato |

**Backend (equipo separado):** Django + Django REST Framework.

## Estructura del proyecto

```
src/
├── actions/          # Acciones Redux
├── components/       # Componentes funcionales (kebab-case)
├── reducers/         # Reducers Redux
├── services/         # Repositorios de API (con withServiceHandler)
├── styles/           # CSS modules
├── utils/            # Utilidades (TokenService, notificationService, errorHandler, logError)
├── App.jsx           # Root component: routing + auth reactiva + Error Boundaries
├── http-common.js    # Instancia de Axios + interceptores (auth, refresh, errores)
├── store.js          # Configuración del store (Redux Toolkit)
└── index.jsx         # Entry point (createRoot + GlobalErrorBoundary)
```

La configuración del build tool vive en `vite.config.mjs` (raíz) y el entry HTML en `index.html` (raíz).

Convenciones adoptadas:

- Componentes **funcionales + Hooks** (nunca clase).
- Archivos en **kebab-case**.
- **CSS**: Bootstrap 5.3 + CSS modules (mínimo inline).
- **Errores**: `ErrorBoundary` por sección + notificaciones centralizadas.
- **API calls**: servicios con `try/catch` + feedback al usuario.

## Scripts disponibles

En el directorio del proyecto:

| Script | Descripción |
|--------|-------------|
| `npm start` | Servidor de desarrollo Vite con HMR (recarga en caliente) |
| `npm run build` | Build de producción en `dist/` (minificado, con hashes) |
| `npm run preview` | Sirve localmente el build de producción (`dist/`) |
| `npm run lint` | Ejecuta ESLint sobre `src/` |
| `npm run format` | Formatea el código con Prettier |
| `npm run format:check` | Verifica el formato sin modificar archivos |

## Docker

El proyecto está contenerizado (`Dockerfile` multi-etapa + `nginx.conf`) y orquestado con `docker-compose.yml`:

```bash
docker-compose up --build
```

## Variables de entorno

Este proyecto utiliza variables de entorno para configurar el comportamiento en distintos entornos (desarrollo, producción).

| Variable | Descripción | Obligatoria | Ejemplo |
|----------|-------------|:-----------:|---------|
| `REACT_APP_API_URL` | URL base del API de Django REST. Se usa como `baseURL` en las peticiones Axios. Se expone al cliente vía `import.meta.env.REACT_APP_API_URL` (prefijo `REACT_APP_` habilitado en `vite.config.mjs`). | Sí | `http://localhost:8080/api/v1` |
| `PORT` | Puerto del servidor de desarrollo de Vite. Solo aplica en entorno local (se lee en `vite.config.mjs` vía `loadEnv`). | No (default: 3000) | `8090` |

### Configuración típica para desarrollo local

El proyecto incluye los siguientes archivos de entorno versionados:

- `.env.development` — Usado automáticamente al ejecutar `npm start` (desarrollo). Contiene `PORT=3000` y `REACT_APP_API_URL=http://localhost:8080/api/v1`.
- `.env.production` — Usado automáticamente al ejecutar `npm run build` (producción). Contiene `REACT_APP_API_URL=https://api.telepark.com/api/v1` (placeholder).
- `.env` — Archivo de respaldo de baja prioridad. Aplica si no existe un archivo específico del entorno.

> **Importante:** Los archivos `.env*.local` están en `.gitignore` y no deben versionarse. Úsalos para configuración local sensible.

### Orden de precedencia (Vite)

Las variables se resuelven en el siguiente orden (de mayor a menor prioridad):

1. `.env.development.local` / `.env.production.local` (no versionados)
2. `.env.development` / `.env.production` (versionados, específicos del entorno)
3. `.env` (versionado, respaldo genérico)
4. Variables de entorno del sistema (sobrescriben todo)

Solo las variables con prefijo `REACT_APP_` o `VITE_` se exponen al cliente (`import.meta.env.*`). `PORT` no se expone al cliente; solo lo consume `vite.config.mjs`.
