import React from 'react';

/**
 * ErrorFallbackRoute — Tarjeta de error contextual (NIVEL 2)
 *
 * Se muestra cuando un error ocurre dentro de una ruta específica.
 * Las demás rutas y el layout (sidebar, navbar) siguen funcionando.
 *
 * @param {Error}  error              - El error capturado
 * @param {Function} resetErrorBoundary - Función para reintentar
 * @param {string} componentName      - Nombre del componente que falló (custom prop)
 */
const ErrorFallbackRoute = ({ error, resetErrorBoundary, componentName }) => {
  return (
    <div className="container py-4">
      <div className="card border-warning shadow-sm">
        <div className="card-header bg-warning text-dark d-flex align-items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <span className="fw-bold">
            Error en {componentName || 'esta sección'}
          </span>
        </div>
        <div className="card-body">
          <p className="card-text text-muted">
            Ocurrió un error al cargar esta sección. Las demás secciones de la
            aplicación no se vieron afectadas.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="alert alert-secondary py-2 px-3 mb-3">
              <strong className="small">Error:</strong>
              <pre className="mb-0 mt-1" style={{ fontSize: '0.75rem' }}>
                {error.message}
              </pre>
            </div>
          )}

          <button className="btn btn-outline-warning" onClick={resetErrorBoundary}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-clockwise me-1"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
              />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallbackRoute;
