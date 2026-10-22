import React from 'react';
import PropTypes from 'prop-types';
import { MoonIcon, SunIcon } from '../icons/icons-shared';

const ThemeToggle = ({ theme, onToggle, className = '' }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      onClick={onToggle}
    >
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
};

ThemeToggle.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ThemeToggle;
