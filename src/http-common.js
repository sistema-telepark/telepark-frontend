import axios from 'axios';
import { TokenService } from './services/token.service';

const instance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
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
    // Normalizar estructura del error para el downstream
    if (err.response) {
      const { status, data } = err.response;
      if (status === 422 && Array.isArray(data)) {
        err.response.data = { message: data.map((e) => e.msg || e).join(', ') };
      }
      if (status === 400 && typeof data === 'object' && !data.message) {
        err.response.data = { message: data.detail || 'Solicitud inválida' };
      }
    }
    return Promise.reject(err);
  }
);
export default instance;
