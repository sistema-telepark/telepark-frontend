// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// OWASP-03: Configuración de variables de entorno para tests
// Evita exponer credenciales reales o URLs de producción.
process.env.REACT_APP_API_URL = 'http://localhost:8080/api/v1';

// OWASP-02: Mock global de TokenService para simular tokens expirados
// y eventos auth-change (patrón App.test.js).
// Los componentes individuales no importan TokenService directamente,
// pero este mock global asegura que las suites de integración no fallen.
// Nota: jest.mock factory no puede referenciar variables externas,
// por lo que usamos global.localStorage y global.dispatchEvent.
jest.mock('./services/token.service', () => ({
  TokenService: {
    getLocalRefreshToken: jest.fn(() => 'test-refresh-token'),
    getLocalAccessToken: jest.fn(() => 'test-access-token'),
    updateLocalAccessToken: jest.fn((token) => {
      global.dispatchEvent(new CustomEvent('auth-change'));
    }),
    getUser: jest.fn(() => null),
    setUser: jest.fn((user) => {
      global.localStorage.setItem('user', JSON.stringify(user));
      global.dispatchEvent(new CustomEvent('auth-change'));
    }),
    removeUser: jest.fn(() => {
      global.localStorage.removeItem('user');
      global.dispatchEvent(new CustomEvent('auth-change'));
    }),
    getUsername: jest.fn(() => 'drhouse'),
    getName: jest.fn(() => 'Dr. House'),
    getRole: jest.fn(() => false),
  },
}));
