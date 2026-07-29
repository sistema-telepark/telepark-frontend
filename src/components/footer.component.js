import React from 'react';
import logoTelepark from '../images/logo2022.png';

class Footer extends React.Component {
  render() {
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
  }
}
export default Footer;
