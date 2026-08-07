/**
 * T-N1 — Smoke de componentes migrados a CSS Modules (Fase C, feature 4.5)
 *
 * Por cada componente migrado: (1) renderiza sin errores y (2) las clases
 * de su CSS Module se resuelven a su propio nombre via identity-obj-proxy
 * (validado en la sonda R-V1 durante la planificación).
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Footer from '../components/footer.component';
import ErrorFallbackGlobal from '../components/error-boundary/error-fallback-global.component';
import ErrorFallbackRoute from '../components/error-boundary/error-fallback-route.component';
import ObraSocialForm from '../components/list-obrasocial/obra-social-form.component';
import GestionEventos from '../components/gestion-eventos.component';
import Login from '../components/login.component';

import stylesFooter from '../styles/footer.module.css';
import stylesGlobal from '../styles/error-fallback-global.module.css';
import stylesRoute from '../styles/error-fallback-route.module.css';
import stylesObraSocial from '../styles/obra-social-form.module.css';
import stylesGestion from '../styles/gestion-eventos.module.css';
import stylesLogin from '../styles/login.module.css';

// Stub del service para evitar llamadas de red en el mount de GestionEventos (D2 -> Opcion B)
jest.mock('../services/event.service', () => ({
  eventRespository: {
    getPersonAll: jest.fn().mockResolvedValue({ data: [] }),
    getEventAll: jest.fn().mockResolvedValue({ data: [] }),
  },
}));

describe('T-N1: Smoke de componentes migrados a CSS Modules', () => {
  it('footer renderiza con la clase logo migrada', () => {
    render(<Footer />);
    expect(stylesFooter.logo).toBe('logo');
    expect(screen.getByAltText('logo de telepark')).toBeTruthy();
  });

  it('error-fallback-global renderiza y mapea las clases del nivel 1', () => {
    render(<ErrorFallbackGlobal error={new Error('boom global')} />);
    expect(stylesGlobal.pageBackground).toBe('pageBackground');
    expect(stylesGlobal.leadText).toBe('leadText');
    expect(stylesGlobal.devAlert).toBe('devAlert');
    expect(stylesGlobal.devPre).toBe('devPre');
  });

  it('error-fallback-route renderiza y mapea la clase errorPre', () => {
    render(
      <ErrorFallbackRoute error={new Error('boom route')} resetErrorBoundary={() => {}} />
    );
    expect(stylesRoute.errorPre).toBe('errorPre');
  });

  it('obra-social-form renderiza y mapea las clases de acciones', () => {
    render(
      <ObraSocialForm
        titulo="Obra Social"
        funcionCambiar={() => {}}
        value=""
        obrasociales={[]}
        funcionConfirmar={() => {}}
        funcionCancelar={() => {}}
      />
    );
    expect(stylesObraSocial.formActions).toBe('formActions');
    expect(stylesObraSocial.submitButton).toBe('submitButton');
    expect(stylesObraSocial.cancelButton).toBe('cancelButton');
  });

  it('gestion-eventos renderiza con service stub y mapea errorText', async () => {
    render(<GestionEventos />);
    expect(stylesGestion.errorText).toBe('errorText');
  });

  it('login renderiza dentro de router y mapea las clases del formulario', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(stylesLogin.formContainer).toBe('formContainer');
    expect(stylesLogin.formCard).toBe('formCard');
    expect(stylesLogin.logoWrapper).toBe('logoWrapper');
    expect(stylesLogin.logo).toBe('logo');
    expect(stylesLogin.formCenter).toBe('formCenter');
    expect(stylesLogin.labelLeft).toBe('labelLeft');
    expect(stylesLogin.labelPassword).toBe('labelPassword');
    expect(stylesLogin.submitButton).toBe('submitButton');
  });
});
