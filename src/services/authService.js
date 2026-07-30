import http from '../http-common';
import { withServiceHandler } from './errorHandler';

const auth = {
  async login(data) {
    const response = await http.post(`/auth/login`, data);
    return response.data;
  },
};

export const authRepository = {
  login: withServiceHandler(auth.login, { context: 'iniciar sesión' }),
  logout() {
    localStorage.removeItem('user');
  },
};
