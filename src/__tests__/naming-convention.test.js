/**
 * T-N2 — Gate de naming como test (validation.md §4.3, decisión PO D1, Opción 1).
 *
 * Espejo permanente de G3/G7 dentro de `npm test`:
 *   R1. Ningún import relativo con PascalCase/camelCase en el alcance del contrato (RF-1:
 *       components/, services/, styles/, utils/ y subdirectorios).
 *   R2. Ningún import relativo con sufijo `Service` (mismo alcance).
 *   R3. El CSS de Bootstrap existe únicamente en `src/index.js` (RF-5).
 *
 * Excepciones documentadas del contrato (requirements.md):
 *   - S1: assets en `images/` (p.ej. logoTelepark2022.png) y raíz de tooling CRA.
 *   - §4.1: `error-boundary/logError.js` clasificado OK (fuera del mapa de renombres).
 * El test recorre `src/**` con fs (sin node_modules) y falla ante cualquier violación.
 * Nota: la ruta de Bootstrap se construye por partes para no alterar el grep G3 (1 match).
 */
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..');
const IN_SCOPE_DIRS = ['components', 'services', 'styles', 'utils'];
const EXEMPT_PATH_MARKERS = ['/images/', '/logError'];
const BOOTSTRAP_CSS = ['bootstrap/dist', 'css'].join('/');

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(e.name)) out.push(p);
  }
}

function isInScope(file) {
  const rel = path.relative(SRC, file);
  return IN_SCOPE_DIRS.some((d) => rel === d || rel.startsWith(d + path.sep));
}

function isExempt(importPath) {
  return EXEMPT_PATH_MARKERS.some((m) => importPath.includes(m));
}

function extractImportPaths(content) {
  const paths = [];
  const reStatic = /from\s+'([^']+)'/g;
  const reLazy = /import\(\s*(?:\/\*[^*]*\*\/\s*)?'([^']+)'\)/g;
  let m;
  while ((m = reStatic.exec(content)) !== null) paths.push(m[1]);
  while ((m = reLazy.exec(content)) !== null) paths.push(m[1]);
  return paths;
}

describe('T-N2 — gate de naming (espejo G3/G7)', () => {
  test('no hay paths de import relativos con [A-Z] ni sufijo Service en el alcance RF-1, y bootstrap solo en index.js', () => {
    const files = [];
    walk(SRC, files);
    const violations = [];

    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      const rel = path.relative(SRC, f).split(path.sep).join('/');

      // R3 (G3): CSS de Bootstrap permitido únicamente en src/index.js
      if (content.includes(BOOTSTRAP_CSS) && rel !== 'index.js') {
        violations.push(rel + ': bootstrap CSS fuera de index.js');
      }

      if (!isInScope(f)) continue;

      // R1 + R2 (G7): paths relativos con mayúscula o sufijo Service
      for (const p of extractImportPaths(content)) {
        if (!p.startsWith('.') || isExempt(p)) continue;
        if (/[A-Z]/.test(p)) violations.push(rel + ': path con mayuscula -> ' + p);
        if (/Service$/.test(p)) violations.push(rel + ': sufijo Service -> ' + p);
      }
    }

    expect(violations).toEqual([]);
  });
});
