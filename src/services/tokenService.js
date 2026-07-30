/**
 * TokenService — Gestión de autenticación en localStorage.
 *
 * NOTA: Este servicio NO implementa withServiceHandler porque TODOS sus métodos
 * son síncronos (solo operan sobre localStorage) y no realizan llamadas HTTP.
 * Además, es importado directamente por http-common.js (interceptor Axios), por lo
 * que envolverlo con withServiceHandler rompería el interceptor de refresh token.
 * Si en el futuro se agregan métodos async con HTTP, deben migrarse al patrón
 * withServiceHandler por separado.
 */
export const TokenService = {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.refresh;
  },

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.access;
  },

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem('user'));
    user.access = token;
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth-change'));
  },

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  setUser(user) {
    console.log(JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth-change'));
  },

  removeUser() {
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth-change'));
  },

  getUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.username;
  },

  getName() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.name;
  },

  getRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.is_superuser;
  },
};
