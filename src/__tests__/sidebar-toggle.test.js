/**
 * Suite de regresión del toggle del Sidebar (Sprint 4.7 — Fix Menú Desktop).
 *
 * Cubre RF-01/02/04/06/07 y los CA-01, CA-02, CA-04, CA-05, CA-06, CA-07:
 *   T1  Smoke: renderiza el sidebar cerrado con navegación y logout (CA-06)
 *   T2  Desktop: click en la hamburguesa abre/cierra (CA-01)
 *   T3  aria-expanded reactivo + aria-label dinámico (CA-04)
 *   T4  Móvil: click sobre el logo alterna (burbujea al botón) (CA-02)
 *   T5  CSS estático: hamburguesa visible en desktop abierto; oculta en móvil (CA-04, R7)
 *   T6  CSS estático: focus-visible del toggle con outline (RNF-01/CA-04)
 *   T7  CA-07 grep: sin DOM imperativo en sidebar.component.js
 *   T8  CA-05 grep: botón muerto eliminado en list-pacientes-ep.component.js
 *
 * Patrón de stubs copiado de la suite existente (validation.md §4.1): se mockea
 * TokenService para evitar dependencia de localStorage; jsdom no evalúa media
 * queries (R7), por lo que "desktop/móvil" se resuelven a nivel de componente +
 * aserciones estáticas del CSS.
 */
import fs from 'fs';
import path from 'path';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Sidebar from '../components/sidebar.component';

jest.mock('../services/token.service', () => ({
  TokenService: {
    getRole: jest.fn(() => false),
    removeUser: jest.fn(),
  },
}));

const SIDEBAR_CSS = path.join(__dirname, '..', 'styles', 'sidebar.css');

describe('Sidebar toggle (Sprint 4.7 — Fix Menú Desktop)', () => {
  test('smoke: renderiza el sidebar cerrado con navegación y logout', () => {
    render(<Sidebar />);
    const sidebar = document.querySelector('#sidebar');
    expect(sidebar).not.toBeNull();
    expect(sidebar.classList.contains('sidebar')).toBe(true);
    expect(sidebar.classList.contains('open')).toBe(false);
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cerrar Sesión').length).toBeGreaterThan(0);
  });

  test('desktop: click en la hamburguesa abre y cierra el sidebar', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);
    const sidebar = document.querySelector('#sidebar');

    await user.click(screen.getByRole('button', { name: /abrir menú/i }));
    expect(sidebar.classList.contains('open')).toBe(true);

    await user.click(screen.getByRole('button', { name: /cerrar menú/i }));
    expect(sidebar.classList.contains('open')).toBe(false);
  });

  test('aria-expanded y aria-label reflejan el estado de React', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);
    const toggle = screen.getByRole('button', { name: /abrir menú/i });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-label', 'Abrir menú');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-label', 'Cerrar menú');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-label', 'Abrir menú');
  });

  test('movil: click sobre el logo alterna el sidebar (burbujea al botón)', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);
    const sidebar = document.querySelector('#sidebar');
    const logo = screen.getByAltText('logo de telepark');

    await user.click(logo);
    expect(sidebar.classList.contains('open')).toBe(true);
    expect(screen.getByRole('button', { name: /cerrar menú/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    await user.click(logo);
    expect(sidebar.classList.contains('open')).toBe(false);
    expect(screen.getByRole('button', { name: /abrir menú/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  test('css: la hamburguesa NO se oculta en desktop abierto y SÍ en móvil', () => {
    const css = fs.readFileSync(SIDEBAR_CSS, 'utf8');

    // RF-04: el bloque `.sidebar.open .logo-details svg` no existe o no oculta (B3 corregido)
    expect(css).not.toMatch(/\.sidebar\.open \.logo-details svg\s*\{[^}]*display:\s*none/);

    // RF-02: la media query móvil conserva el ocultamiento del svg
    const idx = css.indexOf('@media (max-width: 576px) {');
    expect(idx).toBeGreaterThan(-1);
    const mediaMovil = css.slice(idx);
    expect(mediaMovil).toMatch(/\.sidebar \.logo-details svg\s*\{\s*display:\s*none/);

    // RF-02: el media query móvil restaura el img del toggle (logo como toggle)
    expect(mediaMovil).toMatch(
      /\.sidebar \.logo-details \.menu-toggle img\s*\{\s*display:\s*inline-block/
    );
  });

  test('css: el logo-details es flex centrado y el img no ocupa layout en desktop cerrado', () => {
    const css = fs.readFileSync(SIDEBAR_CSS, 'utf8');

    // (a) el contenedor del botón es flex y centra horizontal y verticalmente
    expect(css).toMatch(/\.sidebar \.logo-details\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/\.sidebar \.logo-details\s*\{[^}]*justify-content:\s*center/);
    expect(css).toMatch(/\.sidebar \.logo-details\s*\{[^}]*align-items:\s*center/);

    // (b) fuera del media query el img del toggle está oculto (no ocupa layout)
    const idxMedia = css.indexOf('@media (max-width: 576px) {');
    const cssDesktop = css.slice(0, idxMedia);
    expect(cssDesktop).toMatch(/\.sidebar \.logo-details \.menu-toggle img\s*\{\s*display:\s*none/);

    // RF-04: en desktop abierto el logo vuelve a ser visible
    expect(css).toMatch(
      /\.sidebar\.open \.logo-details \.menu-toggle img\s*\{\s*display:\s*inline-block/
    );
  });

  test('css: el toggle tiene focus-visible con outline', () => {
    const css = fs.readFileSync(SIDEBAR_CSS, 'utf8');
    expect(css).toMatch(/\.menu-toggle:focus-visible\s*\{[^}]*outline:/);
  });

  test('CA-07: sidebar.component.js usa useState y no manipula el DOM imperativamente', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', 'components', 'sidebar.component.js'),
      'utf8'
    );
    // Cadena construida por partes (patrón naming-convention.test.js) para no
    // interferir con el grep V2 del validador sobre src/ completo
    const domSelectorImperativo = ['getElement', "ById('sidebar')"].join('');
    expect(src).not.toContain(domSelectorImperativo);
    expect(src).not.toContain('classList');
    expect(src).toContain('useState');
  });

  test('CA-05: list-pacientes-ep.component.js sin botón muerto ni SearchIcon', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', 'components', 'list-pacientes-ep.component.js'),
      'utf8'
    );
    expect(src).not.toContain('SearchIcon');
    expect(src).not.toMatch(/<button type="button" className="btn btn-verde">/);
  });
});
