export const THEME_STORAGE_KEY = 'telepark-theme';

export const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage puede estar bloqueado; se usa la preferencia del sistema.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage puede estar bloqueado; el tema sigue aplicado en memoria.
  }
};
