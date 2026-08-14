import React from 'react';
import PropTypes from 'prop-types';
import { WarningIcon, ReloadIcon } from '../icons/icons-shared';
import styles from '../../styles/error-fallback-route.module.css';

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
          <WarningIcon size={20} />
          <span className="fw-bold">Error en {componentName || 'esta sección'}</span>
        </div>
        <div className="card-body">
          <p className="card-text text-muted">
            Ocurrió un error al cargar esta sección. Las demás secciones de la aplicación no se
            vieron afectadas.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="alert alert-secondary py-2 px-3 mb-3">
              <strong className="small">Error:</strong>
              <pre className={'mb-0 mt-1 ' + styles.errorPre}>{error.message}</pre>
            </div>
          )}

          <button className="btn btn-outline-warning" onClick={resetErrorBoundary}>
            <ReloadIcon className="me-1" />
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorFallbackRoute.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  resetErrorBoundary: PropTypes.func.isRequired,
  componentName: PropTypes.string,
};

export default ErrorFallbackRoute;
