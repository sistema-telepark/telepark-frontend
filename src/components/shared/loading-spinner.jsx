import React from 'react';

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <div className="spinner-border text-primary" role="status" aria-label="Cargando sección">
      <span className="visually-hidden">Cargando sección...</span>
    </div>
  </div>
);

export default LoadingSpinner;
