/**
 * T-V1 — Smoke de AddPaciente (CA-07, feature 2026-08-07-corregir-bugs-menores)
 *
 * Autorizado por validation.md §4.2 como evidencia mecánica de CA-07 (RF-05/06/07:
 * conversión de DatosPersonales/Vivienda a componentes JSX reales sin cambio
 * observable). Puntos de diseño:
 *   1. Stubs de municipio.service (getAll) y paciente.service (guardarPaciente).
 *      NO se mockea utils (retornarProvincias() es puro y determinista).
 *   2. Estructura: Datos Personales x2, Datos de Vivienda x2, Persona con EP x1,
 *      Referente x1, selects Provincia/Municipio x2 cada uno.
 *   3. Cascada EP con re-filtrado (Buenos Aires -> La Plata; Córdoba -> Río Cuarto).
 *   4. Cascada R (misma provincia en EP y R -> municipio duplicado EP + R).
 *   5. Errores inline con form vacío.
 *   6. Sin red: guardarPaciente no fue llamado (submit inválido nunca llega al servicio).
 *   7. Uso de findBy* y waitFor para todo lo asíncrono.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPaciente from '../components/add-paciente.component';
import { municipioRepository } from '../services/municipio.service';
import { pacienteRepository } from '../services/paciente.service';

// Punto 1 — Stubs deterministas (sin red real)
jest.mock('../services/municipio.service', () => ({
  municipioRepository: {
    getAll: jest.fn(),
  },
}));

jest.mock('../services/paciente.service', () => ({
  pacienteRepository: {
    guardarPaciente: jest.fn(),
  },
}));

const MUNICIPIOS_MOCK = [
  { idmunicipio: 1, nombre: 'La Plata', provincia: 'Buenos Aires' },
  { idmunicipio: 2, nombre: 'Mar del Plata', provincia: 'Buenos Aires' },
  { idmunicipio: 3, nombre: 'Río Cuarto', provincia: 'Córdoba' },
];

describe('T-V1: Smoke de AddPaciente (EP + Referente)', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    municipioRepository.getAll.mockResolvedValue({ data: MUNICIPIOS_MOCK });
    // Silencia los console.* pre-existentes de add-paciente.component.js
    // (fuera de alcance de la feature; no se agregan salidas de log nuevas).
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('estructura: EP + Referente con Datos Personales, Vivienda y selects de cascada', async () => {
    render(<AddPaciente />);

    // Punto 2 — Estructura esperada (2 secciones de cada bloque, 1 título de cada)
    expect(screen.getAllByText('Datos Personales')).toHaveLength(2);
    expect(screen.getAllByText('Datos de Vivienda')).toHaveLength(2);
    expect(screen.getByText('Persona con EP')).toBeInTheDocument();
    expect(screen.getByText('Referente')).toBeInTheDocument();

    // 2 selects de Provincia (EP + R) y 2 selects de Municipio (EP + R)
    expect(screen.getAllByRole('option', { name: 'Provincia' })).toHaveLength(2);
    expect(screen.getAllByRole('option', { name: 'Municipio' })).toHaveLength(2);
  });

  it('cascada provincia -> municipio viva con re-filtrado en EP y en R', async () => {
    render(<AddPaciente />);

    // Punto 3 — Select Provincia EP (primer select de provincia en el DOM)
    const provinciaEpSelect = screen
      .getAllByRole('option', { name: 'Provincia' })[0]
      .closest('select');
    const provinciaRSelect = screen
      .getAllByRole('option', { name: 'Provincia' })[1]
      .closest('select');

    // Buenos Aires -> La Plata y Mar del Plata; Río Cuarto ausente
    fireEvent.change(provinciaEpSelect, { target: { value: 'Buenos Aires' } });
    expect(await screen.findByText('La Plata')).toBeInTheDocument();
    expect(screen.getByText('Mar del Plata')).toBeInTheDocument();
    expect(screen.queryByText('Río Cuarto')).not.toBeInTheDocument();

    // Re-filtrado (cascada viva, no solo primer render): Córdoba -> Río Cuarto; La Plata ausente
    fireEvent.change(provinciaEpSelect, { target: { value: 'Córdoba' } });
    expect(await screen.findByText('Río Cuarto')).toBeInTheDocument();
    expect(screen.queryByText('La Plata')).not.toBeInTheDocument();

    // Punto 4 — Cascada R: EP vuelve a Buenos Aires y R elige Buenos Aires ->
    // 'La Plata' aparece 2 veces (una por select de Municipio: EP + R)
    fireEvent.change(provinciaEpSelect, { target: { value: 'Buenos Aires' } });
    fireEvent.change(provinciaRSelect, { target: { value: 'Buenos Aires' } });
    await waitFor(() => expect(screen.getAllByText('La Plata')).toHaveLength(2));
  });

  it('errores inline con form vacío y sin llamada de red al servicio', async () => {
    render(<AddPaciente />);

    // Punto 5 — Submit con form vacío dispara validación react-hook-form (errores inline)
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() =>
      expect(screen.getAllByText('El campo no puede estar vacío').length).toBeGreaterThan(0)
    );

    // Punto 6 — Sin red: el submit inválido nunca llega al servicio
    expect(pacienteRepository.guardarPaciente).not.toHaveBeenCalled();
  });
});
