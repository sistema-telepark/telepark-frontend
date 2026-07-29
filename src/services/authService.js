import http from '../http-common';

export const authRepository = {
  async login(data) {
    let response = await http.post(`/auth/login`, data);

    return response;
  },

  logout() {
    localStorage.removeItem('user');
  },
};
