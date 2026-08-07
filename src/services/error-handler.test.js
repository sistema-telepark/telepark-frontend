import { normalizeError, withServiceHandler } from './error-handler';
import { logAsyncError } from '../components/error-boundary/logError';
import { showToast, showModal } from './notification.service';

jest.mock('../components/error-boundary/logError', () => ({
  logAsyncError: jest.fn(),
}));

jest.mock('./notification.service', () => ({
  showToast: jest.fn(),
  showModal: jest.fn(),
}));

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('normalizeError', () => {
    it('debe retornar severity toast para status 400', () => {
      const error = { response: { status: 400, data: { message: 'Solicitud inválida' } } };
      const result = normalizeError(error);
      expect(result).toEqual({
        message: 'Solicitud inválida',
        status: 400,
        severity: 'toast',
      });
    });

    it('debe concatenar mensajes para error 422 con array', () => {
      const error = { response: { status: 422, data: [{ msg: 'Campo requerido' }, { msg: 'Valor inválido' }] } };
      const result = normalizeError(error);
      expect(result.message).toBe('Campo requerido, Valor inválido');
      expect(result.severity).toBe('toast');
    });

    it('debe retornar severity modal para status 500', () => {
      const error = { response: { status: 500, data: { message: 'Error interno' } } };
      const result = normalizeError(error);
      expect(result).toEqual({
        message: 'Error interno',
        status: 500,
        severity: 'modal',
      });
    });

    it('debe detectar Network Error (ERR_NETWORK)', () => {
      const error = { code: 'ERR_NETWORK' };
      const result = normalizeError(error);
      expect(result).toEqual({
        message: 'Error de conexión. Verifique su red.',
        status: 0,
        severity: 'modal',
      });
    });

    it('debe manejar error genérico sin response', () => {
      const error = new Error('Algo salió mal');
      const result = normalizeError(error);
      expect(result).toEqual({
        message: 'Algo salió mal',
        status: 0,
        severity: 'modal',
      });
    });
  });

  describe('withServiceHandler', () => {
    it('debe retornar { success: true, data } en caso exitoso', async () => {
      const fn = jest.fn().mockResolvedValue('resultado');
      const wrapped = withServiceHandler(fn, { context: 'test' });
      const result = await wrapped('arg1');
      expect(result).toEqual({ success: true, data: 'resultado' });
    });

    it('debe capturar error y retornar { success: false, error }', async () => {
      const error = new Error('Algo falló');
      const fn = jest.fn().mockRejectedValue(error);
      const wrapped = withServiceHandler(fn, { context: 'test' });
      const result = await wrapped('arg1');
      expect(result).toEqual({ success: false, error: 'Algo falló' });
      expect(logAsyncError).toHaveBeenCalled();
    });

    it('debe llamar a showToast para errores toast', async () => {
      const error = { response: { status: 400, data: { message: 'Bad request' } } };
      const fn = jest.fn().mockRejectedValue(error);
      const wrapped = withServiceHandler(fn, { context: 'test' });
      await wrapped();
      expect(showToast).toHaveBeenCalledWith('error', 'Bad request', { timer: 4000 });
    });

    it('debe llamar a showModal para errores modal', async () => {
      const error = { response: { status: 500, data: { message: 'Error interno' } } };
      const fn = jest.fn().mockRejectedValue(error);
      const wrapped = withServiceHandler(fn, { context: 'test' });
      await wrapped();
      expect(showModal).toHaveBeenCalledWith('error', 'Error', 'Error interno');
    });

    it('no debe mostrar notificación si showNotification es false', async () => {
      const error = new Error('Silenciado');
      const fn = jest.fn().mockRejectedValue(error);
      const wrapped = withServiceHandler(fn, { context: 'test', showNotification: false });
      await wrapped();
      expect(showToast).not.toHaveBeenCalled();
      expect(showModal).not.toHaveBeenCalled();
    });

    it('debe forzar severity si se especifica en options', async () => {
      const error = { response: { status: 400, data: { message: 'Bad request' } } };
      const fn = jest.fn().mockRejectedValue(error);
      const wrapped = withServiceHandler(fn, { context: 'test', severity: 'modal' });
      await wrapped();
      expect(showModal).toHaveBeenCalled();
      expect(showToast).not.toHaveBeenCalled();
    });
  });
});
