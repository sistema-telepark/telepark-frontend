import http from '../http-common';

const auth = {
  async login(data) {
    const response = await http.post(`/auth/login`, data);
    return response.data;
  },
};

export const authRepository = {
  // NOTA: login NO se envuelve con withServiceHandler a propósito. Ese wrapper
  // captura el error y devuelve { success:false } (nunca lanza), lo que hacía que
  // el componente Login tratara credenciales inválidas como éxito. El componente
  // maneja el error (normalización + notificación) en su propio catch.
  login: auth.login,
  logout() {
    localStorage.removeItem('user');
  },
};
