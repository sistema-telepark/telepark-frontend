import React, { memo } from 'react';
import logoTelepark from '../images/logo2022.png';
import styles from '../styles/footer.module.css';

const Footer = () => {
  return (
    <footer>
      <img
        className={"logo " + styles.logo}
        src={logoTelepark}
        alt="logo de telepark"
      />
    </footer>
  );
};
export default memo(Footer);
