# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Variables de Entorno

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

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
