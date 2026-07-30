import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorFallbackInline — Alerta inline de error (NIVEL 3)
 *
 * Para subsecciones dentro de un componente complejo.
 * Mínima intrusión visual, permite reintento local.
 *
 * @param {Error}  error              - El error capturado
 * @param {Function} resetErrorBoundary - Función para reintentar
 * @param {string} message            - Mensaje personalizado (opcional)
 */
const ErrorFallbackInline = ({ error, resetErrorBoundary, message }) => {
  return (
    <div className="alert alert-warning d-flex align-items-center justify-content-between flex-wrap gap-2 m-2">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-exclamation-triangle-fill me-2"
          viewBox="0 0 16 16"
        >
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
        <span>{message || 'Error al cargar esta sección'}</span>
      </div>
      <button
        className="btn btn-sm btn-outline-warning"
        onClick={resetErrorBoundary}
      >
        Reintentar
      </button>

      {process.env.NODE_ENV === 'development' && (
        <div className="w-100 small text-muted mt-1">
          <code>{error.message}</code>
        </div>
      )}
    </div>
  );
};

ErrorFallbackInline.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  resetErrorBoundary: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default ErrorFallbackInline;
