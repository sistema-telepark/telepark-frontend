import React from 'react';
import PropTypes from 'prop-types';
import logoTelepark from '../../images/logoTelepark2022.png';
import styles from '../../styles/error-fallback-global.module.css';

/**
 * ErrorFallbackGlobal — Pantalla completa de error (NIVEL 1)
 *
 * Se muestra cuando un error no capturado por los boundaries de ruta
 * llega al nivel global. Permite al usuario recargar la aplicación.
 */
const ErrorFallbackGlobal = ({ error }) => {
  return (
    <div
      className={
        'd-flex justify-content-center align-items-center min-vh-100 ' + styles.pageBackground
      }
    >
      <div className="text-center p-5">
        <img src={logoTelepark} alt="Logo Telepark" className={styles.logo} />

        <h1 className="display-4 text-danger mb-3">Algo salió mal</h1>

        <p className={'lead text-muted mb-4 ' + styles.leadText}>
          Ocurrió un error inesperado en la aplicación. Por favor, recargá la página para intentarlo
          de nuevo.
        </p>

        {import.meta.env.DEV && (
          <div className={'alert alert-secondary text-start mb-4 ' + styles.devAlert}>
            <strong>Detalles (solo desarrollo):</strong>
            <pre className={'mb-0 mt-2 ' + styles.devPre}>{error.message}</pre>
          </div>
        )}

        <button className="btn btn-primary btn-lg" onClick={() => window.location.reload()}>
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

ErrorFallbackGlobal.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

export default ErrorFallbackGlobal;
