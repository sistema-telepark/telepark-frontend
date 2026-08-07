# TELEPARK Frontend

Sistema de gestión integral para pacientes con **Enfermedad de Parkinson (EP)** de un centro/taller especializado. Permite administrar el registro, seguimiento médico, evolución, medicación, eventos y obras sociales de cada paciente, consumiendo la API de **Django + Django REST Framework** (desarrollada por equipo separado).

---

## Requisitos previos

- **Node.js** 16+ (recomendado 18+)
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
| Redux Toolkit | 2.2.x | Estado global (slices + `configureStore`) |
| React Router | 6.26.x | Ruteo SPA (`Routes` + `element`) |
| Axios | 1.7.x | HTTP client (con interceptores normalizados) |
| Bootstrap | 5.3.x | CSS framework |
| Reactstrap | 9.2.x | Componentes Bootstrap |
| React Hook Form | 7.55.x | Formularios |
| SweetAlert2 | 11.12.x | Notificaciones y diálogos |
| react-error-boundary | 6.1.x | Error boundaries (global, ruta, inline) |
| react-scripts | 5.0.1 | Build tool (Create React App) |
| ESLint + Prettier | 8.x / 3.x | Calidad de código y formato |
| Testing Library | 14.x | Tests unitarios e integración |

**Backend (equipo separado):** Django + Django REST Framework.

## Estructura del proyecto

```
src/
├── __tests__/        # Tests unitarios, integración y smoke tests
├── actions/          # Acciones Redux
├── components/       # Componentes funcionales (kebab-case)
├── reducers/         # Reducers Redux
├── services/         # Repositorios de API (con withServiceHandler)
├── styles/           # CSS modules
├── utils/            # Utilidades (TokenService, notificationService, errorHandler, logError)
├── App.js            # Root component: routing + auth reactiva + Error Boundaries
├── http-common.js    # Instancia de Axios + interceptores (auth, refresh, errores)
├── store.js          # Configuración del store (Redux Toolkit)
└── index.js          # Entry point (createRoot + GlobalErrorBoundary)
```

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
| `npm start` | Servidor de desarrollo con recarga en caliente y lint en consola |
| `npm test` | Test runner en modo interactivo |
| `npm run build` | Build de producción en `build/` (minificado, con hashes) |
| `npm run lint` | Ejecuta ESLint sobre `src/` |
| `npm run format` | Formatea el código con Prettier |
| `npm run format:check` | Verifica el formato sin modificar archivos |
| `npm run eject` | Expone la configuración de CRA (**unidireccional**, no recomendado) |

## Docker

El proyecto está contenerizado (`Dockerfile` multi-etapa + `nginx.conf`) y orquestado con `docker-compose.yml`:

```bash
docker-compose up --build
```

## Variables de entorno

Este proyecto utiliza variables de entorno para configurar el comportamiento en distintos entornos (desarrollo, producción).

| Variable | Descripción | Obligatoria | Ejemplo |
|----------|-------------|:-----------:|---------|
| `REACT_APP_API_URL` | URL base del API de Django REST. Se usa como `baseURL` en las peticiones Axios. | Sí | `http://localhost:8080/api/v1` |
| `PORT` | Puerto del servidor de desarrollo de CRA. Solo aplica en entorno local. | No (default: 3000) | `8081` |

### Configuración típica para desarrollo local

El proyecto incluye los siguientes archivos de entorno versionados:

- `.env.development` — Usado automáticamente al ejecutar `npm start` (desarrollo). Contiene `PORT=8081` y `REACT_APP_API_URL=http://localhost:8080/api/v1`.
- `.env.production` — Usado automáticamente al ejecutar `npm run build` (producción). Contiene `REACT_APP_API_URL=https://api.telepark.com/api/v1` (placeholder).
- `.env` — Archivo de respaldo de baja prioridad. Aplica si no existe un archivo específico del entorno.

> **Importante:** Los archivos `.env*.local` están en `.gitignore` y no deben versionarse. Úsalos para configuración local sensible.

### Orden de precedencia (CRA)

Las variables se resuelven en el siguiente orden (de mayor a menor prioridad):

1. `.env.development.local` / `.env.production.local` (no versionados)
2. `.env.development` / `.env.production` (versionados, específicos del entorno)
3. `.env` (versionado, respaldo genérico)
4. Variables de entorno del sistema (sobrescriben todo)

Consulta la [documentación oficial de CRA](https://create-react-app.dev/docs/adding-custom-environment-variables/) para más detalles.

## Learn More

Proyecto creado con [Create React App](https://create-react-app.dev/). Documentación adicional:

- [Create React App documentation](https://create-react-app.dev/docs/getting-started)
- [React documentation](https://reactjs.org/)
