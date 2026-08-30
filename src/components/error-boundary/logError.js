/**
 * logError — Logging estructurado para Error Boundaries
 *
 * Registra el error con timestamp, URL actual, mensaje y componentStack.
 * En desarrollo incluye stack traces completos; en producción solo el mensaje.
 * Preparado para futuro envío a backend de telemetría.
 *
 * @param {Error} error  - El error capturado
 * @param {Object} info  - Información adicional ({ componentStack })
 */
export const logError = (error, info) => {
  const entry = {
    error: error.message,
    ...(import.meta.env.DEV && { stack: error.stack, componentStack: info?.componentStack }),
  };
  console.error(`[ErrorBoundary] ${new Date().toISOString()} | ${window.location.pathname}`, entry);
};

export const logAsyncError = (error, context = {}) => {
  const entry = {
    ...context,
    error: error.message,
    ...(import.meta.env.DEV && { stack: error.stack }),
  };
  console.error(`[AsyncError] ${new Date().toISOString()} | ${window.location.pathname}`, entry);
};
