import React from 'react';
import logoTelepark from '../../images/logoTelepark2022.png';

/**
 * ErrorFallbackGlobal — Pantalla completa de error (NIVEL 1)
 *
 * Se muestra cuando un error no capturado por los boundaries de ruta
 * llega al nivel global. Permite al usuario recargar la aplicación.
 */
const ErrorFallbackGlobal = ({ error, resetErrorBoundary }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <div className="text-center p-5">
        <img
          src={logoTelepark}
          alt="Logo Telepark"
          style={{ width: '200px', marginBottom: '2rem' }}
        />

        <h1 className="display-4 text-danger mb-3">Algo salió mal</h1>

        <p className="lead text-muted mb-4" style={{ maxWidth: '500px' }}>
          Ocurrió un error inesperado en la aplicación. Por favor, recargá la
          página para intentarlo de nuevo.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div
            className="alert alert-secondary text-start mb-4"
            style={{ maxWidth: '500px', margin: '0 auto' }}
          >
            <strong>Detalles (solo desarrollo):</strong>
            <pre className="mb-0 mt-2" style={{ fontSize: '0.8rem' }}>
              {error.message}
            </pre>
          </div>
        )}

        <button
          className="btn btn-primary btn-lg"
          onClick={resetErrorBoundary}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-arrow-clockwise me-2"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
          Recargar aplicación
        </button>
      </div>
    </div>
  );
};

export default ErrorFallbackGlobal;
