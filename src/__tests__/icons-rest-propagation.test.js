/**
 * Suite de propagación `...rest` en los 27 iconos (Sprint 4.7 — Fix Menú Desktop).
 *
 * Cubre RF-03 y CA-03:
 *   T1  MenuIcon (familia sidebar): onClick spy + aria-label llegan al <svg> raíz
 *   T2  SearchIcon (familia shared): ídem
 *   T3  CheckIcon (familia nomenclador): ídem
 *   T4  aria-hidden="true" por defecto conservado y sobreescribible vía rest (RF-03/R3)
 *   T5  Grep gate: las 27 firmas desestructuran con `...rest` (11+11+5)
 *
 * Técnica de query (validation.md §4.1.1 / RV2): el svg decorativo trae
 * `aria-hidden="true"` y queda fuera del árbol de accesibilidad, por lo que se
 * consulta con `container.querySelector('svg')` y se hace click directamente.
 */
import fs from 'fs';
import path from 'path';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MenuIcon } from '../components/icons/icons-sidebar';
import { SearchIcon } from '../components/icons/icons-shared';
import { CheckIcon } from '../components/icons/icons-nomenclador';

const ICON_FILES = [
  path.join(__dirname, '..', 'components', 'icons', 'icons-sidebar.jsx'),
  path.join(__dirname, '..', 'components', 'icons', 'icons-shared.jsx'),
  path.join(__dirname, '..', 'components', 'icons', 'icons-nomenclador.jsx'),
];

describe('Iconos propagan ...rest (Sprint 4.7 — Fix Menú Desktop)', () => {
  test('MenuIcon (sidebar): onClick spy se ejecuta y aria-label llega al svg raíz', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const { container } = render(<MenuIcon onClick={onClick} aria-label="test-menu" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'test-menu');

    await user.click(svg);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('SearchIcon (shared): onClick spy se ejecuta y aria-label llega al svg raíz', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const { container } = render(<SearchIcon onClick={onClick} aria-label="test-search" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'test-search');

    await user.click(svg);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('CheckIcon (nomenclador): onClick spy se ejecuta y aria-label llega al svg raíz', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const { container } = render(<CheckIcon onClick={onClick} aria-label="test-check" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'test-check');

    await user.click(svg);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('aria-hidden="true" por defecto se conserva y es sobreescribible vía rest', () => {
    const { container, rerender } = render(<MenuIcon />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    // El rest va después del default: un consumidor puede sobreescribirlo (RF-03/R3)
    rerender(<MenuIcon aria-hidden="false" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'false');
  });

  test('grep gate: los 27 iconos desestructuran con ...rest (11+11+5)', () => {
    const signatures = [];
    const re = /export const \w+ = \(\{([^}]*)\}\)/g;

    for (const file of ICON_FILES) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = re.exec(content)) !== null) {
        signatures.push(match[1]);
      }
    }

    expect(signatures).toHaveLength(27);
    for (const params of signatures) {
      expect(params).toContain('...rest');
    }
  });
});
