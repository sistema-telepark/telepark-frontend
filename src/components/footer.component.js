import React, { memo } from 'react';
import logoTelepark from '../images/logo2022.png';

const Footer = () => {
  return (
    <footer>
      <img
        className="logo"
        src={logoTelepark}
        style={{ width: '150px' }}
        alt="logo de telepark"
      />
    </footer>
  );
};
export default memo(Footer);
