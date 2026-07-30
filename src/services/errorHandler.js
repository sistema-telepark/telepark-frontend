import { logAsyncError } from '../components/error-boundary/logError';
import { showToast, showModal } from './notificationService';

export const normalizeError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    let message = data?.message || data?.detail || `Error ${status}`;
    if (Array.isArray(data)) message = data.map((e) => e.msg || e).join(', ');
    return {
      message,
      status,
      severity: status >= 500 ? 'modal' : 'toast',
    };
  }
  if (error.code === 'ERR_NETWORK') {
    return {
      message: 'Error de conexión. Verifique su red.',
      status: 0,
      severity: 'modal',
    };
  }
  // Error genérico (Error nativo, throw new Error(), etc.)
  return {
    message: error.message || 'Error inesperado',
    status: 0,
    severity: 'modal',
  };
};

export const withServiceHandler = (fn, options = {}) => {
  const { context = '', showNotification = true, severity: forceSeverity } = options;
  return async (...args) => {
    try {
      const result = await fn(...args);
      return { success: true, data: result };
    } catch (error) {
      const normalized = normalizeError(error);
      logAsyncError(error, { service: context, method: fn.name, args });
      if (showNotification) {
        const severity = forceSeverity || normalized.severity;
        if (severity === 'modal') {
          showModal('error', 'Error', normalized.message);
        } else {
          showToast('error', normalized.message, { timer: 4000 });
        }
      }
      return { success: false, error: normalized.message };
    }
  };
};
