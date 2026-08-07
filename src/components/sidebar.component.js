import React, { memo, useState } from 'react';

import '../styles/sidebar.css';

import logoTelepark from '../images/logoTelepark2022.png';
import { TokenService } from '../services/token.service';
import {
  MenuIcon,
  HomeIcon,
  AdminUsersIcon,
  AddPersonIcon,
  SearchSidebarIcon,
  FamilyIcon,
  MedicalRecordIcon,
  NomencladorIcon,
  CalendarIcon,
  TableIcon,
  LogoutIcon,
} from './icons/icons-sidebar';

const Sidebar = (props) => {
  //funciones
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen((prevOpen) => !prevOpen);

  //arrow function para logout
  const logout = () => {
    TokenService.removeUser();
    window.location.href = '/';
  };

  const user_role = TokenService.getRole();
  const current_url = window.location.pathname;

  return (
    <div className={'sidebar ' + (open ? 'open' : '')} id="sidebar">
      <div className="logo-details" id="logo-details">
        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={toggleSidebar}
        >
          <MenuIcon className="bi bi-list" />
          <img className="logo links_name" src={logoTelepark} alt="logo de telepark" />
        </button>
      </div>
      <ul className="nav-list">
        <li>
          <a href="/">
            <HomeIcon />
            <span className="links_name">Home</span>
          </a>
          <span className="tooltip">Home</span>
        </li>
        {user_role === true ? (
          <li className={current_url === '/list-usuarios' ? 'active' : ''}>
            <a href="./list-usuarios">
              <AdminUsersIcon />
              <span className="links_name">Administrar Usuarios</span>
            </a>
            <span className="tooltip">Administrar Usuarios</span>
          </li>
        ) : (
          ''
        )}
        <li className={current_url === '/add-paciente' ? 'active' : ''}>
          <a href="./add-paciente">
            <AddPersonIcon />
            <span className="links_name">Ingresar Persona con EP</span>
          </a>
          <span className="tooltip">Ingresar Persona con EP</span>
        </li>
        <li className={current_url === '/search' ? 'active' : ''}>
          <a href="./search">
            <SearchSidebarIcon />
            <span className="links_name">Criterio de Búsqueda</span>
          </a>
          <span className="tooltip">Criterio de Búsqueda</span>
        </li>

        <li>
          <a href="/">
            <FamilyIcon />
            <span className="links_name">Ingresar/Modificar Familiar</span>
          </a>
          <span className="tooltip">Ingresar/Modificar Familiar</span>
        </li>

        <li className={current_url === '/list-pacientes' ? 'active' : ''}>
          <a href="./list-pacientes">
            <MedicalRecordIcon />
            <span className="links_name">Ingresar Ficha Medica</span>
          </a>
          <span className="tooltip">Ingresar Ficha Medica Persona con EP</span>
        </li>

        <li className={current_url === '/nomenclador' ? 'active' : ''}>
          <a href="./nomenclador">
            <NomencladorIcon />
            <span className="links_name">Modificar Nomencladores</span>
          </a>
          <span className="tooltip">Modificar Nomencladores</span>
        </li>

        <li className={current_url === '/events' ? 'active' : ''}>
          <a href="./events">
            <CalendarIcon />
            <span className="links_name">Ingresar Evento</span>
          </a>
          <span className="tooltip">Ingresar Evento Persona con EP</span>
        </li>

        <li className={current_url === '/type-events' ? 'active' : ''}>
          <a href="./type-events">
            <TableIcon />
            <span className="links_name">Ingresar/Modificar Tipo de evento</span>
          </a>
          <span className="tooltip">Ingresar/Modificar Tipo de evento</span>
        </li>

        <hr className="hr_sidebar"></hr>

        <li>
          <a href="/" onClick={logout}>
            <LogoutIcon />
            <span className="links_name">Cerrar Sesión</span>
          </a>
          <span className="tooltip">Cerrar Sesión</span>
        </li>
      </ul>
    </div>
  );
};

export default memo(Sidebar);
