import axios from 'axios';
import { TokenService } from './services/token.service';

// Política de retry de red: 1 request original + 2 reintentos = 3 intentos totales.
const RETRY_CONFIG = {
  maxRetries: 2,
  baseDelayMs: 500,
  backoffFactor: 2,
  jitterPercent: 0.25,
};

// Solo estas requests se reintentan ante 502/503/504 (idempotentes).
const IDEMPOTENT_METHODS = ['GET', 'HEAD', 'OPTIONS'];

const RETRYABLE_STATUS_CODES = [502, 503, 504];

// Error de red o timeout: reintentable para TODOS los métodos (no matchea ERR_CANCELED).
const isNetworkError = (error) => error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';

// 5xx transitorio: reintentable solo si la request es idempotente.
const isRetryableServerError = (error) => {
  if (!error.response) return false;
  const method = (error.config?.method || '').toUpperCase();
  return (
    RETRYABLE_STATUS_CODES.includes(error.response.status) && IDEMPOTENT_METHODS.includes(method)
  );
};

// Backoff exponencial base 500 ms ×2 con jitter ±25%.
const getRetryDelayMs = (attempt) => {
  const base = RETRY_CONFIG.baseDelayMs * Math.pow(RETRY_CONFIG.backoffFactor, attempt - 1);
  const jitter = 1 + (Math.random() * 2 - 1) * RETRY_CONFIG.jitterPercent;
  return Math.round(base * jitter);
};

const instance = axios.create({
  baseURL:
    import.meta.env.REACT_APP_API_URL ||
    (console.warn('[TELEPARK] WARN: REACT_APP_API_URL no definida, usando fallback localhost'),
    'http://localhost:8080/api/v1'),
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== '/auth/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await instance.post('/auth/refresh', {
            refresh: TokenService.getLocalRefreshToken(),
          });
          const accessToken = rs.data.access;
          TokenService.updateLocalAccessToken(accessToken);
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    // Retry de red: ERR_NETWORK/timeout para todos los métodos; 502/503/504 solo idempotentes
    if (originalConfig && (isNetworkError(err) || isRetryableServerError(err))) {
      const retryCount = originalConfig._retryCount || 0;
      if (retryCount < RETRY_CONFIG.maxRetries) {
        originalConfig._retryCount = retryCount + 1;
        const delayMs = getRetryDelayMs(retryCount + 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return instance(originalConfig);
      }
    }
    // Normalizar estructura del error para el downstream
    if (err.response) {
      const { status, data } = err.response;
      if (status === 422 && Array.isArray(data)) {
        err.response.data = { message: data.map((e) => e.msg || e).join(', ') };
      }
      if (status === 400 && typeof data === 'object' && !data.message) {
        const fieldErrors = Object.entries(data)
          .filter(([key]) => !['detail', 'message'].includes(key))
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        err.response.data = { message: data.detail || fieldErrors || 'Solicitud inválida' };
      }
    }
    return Promise.reject(err);
  }
);
export default instance;
