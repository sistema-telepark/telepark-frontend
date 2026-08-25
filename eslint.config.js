// ESLint 9 flat config — Sprint 5.17 (equivalencia §4.3 del contrato)
// Reemplaza .eslintrc.json (ESLint 8 + eslint-config-react-app, deprecado).
// Nota: `globals` es dependencia transitiva de eslint (no se agrega a
// package.json para preservar la tabla de versiones §3.2 del contrato).
const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', 'vite.config.mjs'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
      'react/no-danger': 'error',
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  eslintConfigPrettier,
];
