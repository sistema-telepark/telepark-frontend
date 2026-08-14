import Swal from 'sweetalert2';
import {
  showToast,
  showModal,
  showConfirm,
  showLoading,
  closeLoading,
} from './notification.service';

// sweetalert2 es una función con propiedades (fire, mixin, etc.).
// El factory del mock se ejecuta ANTES que cualquier let/const del módulo,
// por eso TODO debe estar dentro del factory y exponerse via Swal.
jest.mock('sweetalert2', () => {
  const _mockFire = jest.fn();
  const mixinResult = { fire: _mockFire };

  const swalMock = Object.assign(jest.fn(), {
    mixin: jest.fn(() => mixinResult),
    fire: jest.fn().mockResolvedValue({}),
    showLoading: jest.fn(),
    close: jest.fn(),
    stopTimer: jest.fn(),
    resumeTimer: jest.fn(),
    // Expuesto para los tests
    _mockFire,
  });

  return {
    __esModule: true,
    default: swalMock,
  };
});

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showToast', () => {
    it('debe llamar a fire con icon y title', () => {
      showToast('success', 'Operación exitosa');
      expect(Swal._mockFire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Operación exitosa',
      });
    });

    it('debe permitir opciones adicionales', () => {
      showToast('error', 'Error', { timer: 5000 });
      expect(Swal._mockFire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error',
        timer: 5000,
      });
    });
  });

  describe('showModal', () => {
    it('debe llamar a fire con icon, title, text', () => {
      showModal('error', 'Error', 'Mensaje de error');
      expect(Swal._mockFire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error',
        text: 'Mensaje de error',
        showConfirmButton: true,
      });
    });
  });

  describe('showConfirm', () => {
    it('debe retornar true si el usuario confirma', async () => {
      Swal._mockFire.mockResolvedValue({ isConfirmed: true });
      const result = await showConfirm('¿Está seguro?', 'Acción irreversible');
      expect(result).toBe(true);
    });

    it('debe retornar false si el usuario cancela', async () => {
      Swal._mockFire.mockResolvedValue({ isConfirmed: false });
      const result = await showConfirm('¿Está seguro?', 'Acción irreversible');
      expect(result).toBe(false);
    });
  });

  describe('showLoading', () => {
    it('debe llamar a Swal.fire con loading', () => {
      showLoading('Cargando...');
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: expect.any(Function),
      });
    });
  });

  describe('closeLoading', () => {
    it('debe llamar a Swal.close', () => {
      closeLoading();
      expect(Swal.close).toHaveBeenCalled();
    });
  });
});
