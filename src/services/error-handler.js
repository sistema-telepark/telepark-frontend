import { logAsyncError } from '../components/error-boundary/logError';
import { showToast, showModal } from './notification.service';

const formatValidationErrors = (data) => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) {
    return data
      .map((item) => formatValidationErrors(item))
      .filter(Boolean)
      .join(', ');
  }

  return Object.entries(data)
    .map(([field, value]) => {
      const message = formatValidationErrors(value);
      return message ? `${field}: ${message}` : '';
    })
    .filter(Boolean)
    .join('; ');
};

export const normalizeError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const rawMessage = data?.message || data?.detail;
    // Sprint 5.24 (C2 US-4): si detail/message es objeto {campo:[msgs]} (400 por campo),
    // aplanarlo con formatValidationErrors — evita renderizar "[object Object]".
    const message =
      rawMessage && typeof rawMessage === 'object'
        ? formatValidationErrors(rawMessage)
        : rawMessage || formatValidationErrors(data) || `Error ${status}`;
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
      logAsyncError(error, {
        service: context,
        method: fn.name,
        args,
        response: error.response?.data,
      });
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
