import { logAsyncError } from '../components/error-boundary/logError';
import { showToast } from './notification.service';

const IDENTIFIER_IN_MESSAGE = /\b(?:c[oó]digo|id(?:_[a-z0-9]+)?)\b\s*[:=#]\s*[-#]?\d+\b/gi;

const isInternalField = (field) => /^id(?:_|$)/i.test(field) || /c[oó]digo/i.test(field);

const sanitizeMessage = (message) => {
  if (typeof message !== 'string') return '';
  return message
    .replace(IDENTIFIER_IN_MESSAGE, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const formatValidationErrors = (data) => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (item && typeof item === 'object') {
          // Forma DRF: [{ field, msg }, ...] — usar solo el mensaje
          return item.msg || formatValidationErrors(item);
        }
        return formatValidationErrors(item);
      })
      .filter(Boolean)
      .join(', ');
  }
  if (typeof data === 'object') {
    return Object.entries(data)
      .map(([field, value]) => {
        const message = formatValidationErrors(value);
        if (!message) return '';
        // Los identificadores internos no se muestran al usuario.
        return isInternalField(field) ? message : `${field}: ${message}`;
      })
      .filter(Boolean)
      .join('; ');
  }
  return '';
};

const CONFLICT_FALLBACK = 'El registro está en uso por otros vínculos.';

export const normalizeError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    let message;

    if (status === 409) {
      const detail = data?.detail;
      message =
        (typeof detail === 'string' && detail.trim()) ||
        formatValidationErrors(detail) ||
        CONFLICT_FALLBACK;
    } else {
      const rawMessage = data?.message || data?.detail;
      // Si detail/message es objeto {campo:[msgs]} (400 por campo), aplanarlo con
      // formatValidationErrors — evita renderizar "[object Object]".
      message =
        rawMessage && typeof rawMessage === 'object'
          ? formatValidationErrors(rawMessage)
          : rawMessage || formatValidationErrors(data) || `Error ${status}`;
    }

    return {
      message: sanitizeMessage(message) || (status === 409 ? CONFLICT_FALLBACK : `Error ${status}`),
      status,
      code: data?.code,
      severity: status >= 500 ? 'modal' : 'toast',
    };
  }
  if (error.code === 'ERR_NETWORK') {
    return {
      message: 'Error de conexión. Verifique su red.',
      status: 0,
      code: error.code,
      severity: 'modal',
    };
  }
  // Error genérico (Error nativo, throw new Error(), etc.)
  return {
    message: sanitizeMessage(error.message) || 'Error inesperado',
    status: 0,
    code: error.code,
    severity: 'modal',
  };
};

export const withServiceHandler = (fn, options = {}) => {
  const { context = '', showNotification = true } = options;
  return async (...args) => {
    try {
      const result = await fn(...args);
      return { success: true, data: result };
    } catch (error) {
      const normalized = normalizeError(error);
      // NOTA: no se loguean los args (pueden contener credenciales/contraseñas).
      logAsyncError(error, {
        service: context,
        method: fn.name,
        response: error.response?.data,
      });
      // Los fallos de carga (operaciones de lectura) los muestra cada vista de
      // forma inline con reintento; solo las escrituras notifican automáticamente
      // (toast/modal). Evita el doble aviso (modal de la capa + alerta inline).
      const method = (error.config?.method || '').toUpperCase();
      const esLectura = ['GET', 'HEAD', 'OPTIONS'].includes(method);
      if (showNotification && !esLectura) {
        showToast('error', normalized.message, { timer: 4000 });
      }
      return { success: false, error: normalized.message };
    }
  };
};
