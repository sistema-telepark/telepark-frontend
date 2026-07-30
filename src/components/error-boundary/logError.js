/**
 * logError — Logging estructurado para Error Boundaries
 *
 * Registra el error con timestamp, URL actual, mensaje y componentStack.
 * Preparado para futuro envío a backend de telemetría.
 *
 * @param {Error} error  - El error capturado
 * @param {Object} info  - Información adicional ({ componentStack })
 */
export const logError = (error, info) => {
  console.error(
    `[ErrorBoundary] ${new Date().toISOString()} | ${window.location.pathname}`,
    {
      error: error.message,
      stack: error.stack,
      componentStack: info?.componentStack,
    }
  );
};

export const logAsyncError = (error, context = {}) => {
  console.error(
    `[AsyncError] ${new Date().toISOString()} | ${window.location.pathname}`,
    {
      ...context,
      error: error.message,
      stack: error.stack,
    }
  );
};
