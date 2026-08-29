import React, { memo, useState } from 'react';
import { useLocation } from 'react-router';

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

import { ClipboardDataIcon, ClipboardCheckIcon, EyeIcon } from './icons/icons-shared';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen((prevOpen) => !prevOpen);

  const logout = (e) => {
    e.preventDefault();
    TokenService.removeUser();
    window.location.replace('/');
  };

  const user_role = TokenService.getRole();
  const current_url = useLocation().pathname;

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
        <li className={current_url === '/home' ? 'active' : ''}>
          <a href="/home">
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
            <SearchSidebarIcon />
            <span className="links_name">Buscar Personas</span>
          </a>
          <span className="tooltip">Buscar Personas</span>
        </li>

        <li className={current_url === '/familiar' ? 'active' : ''}>
          <a href="./familiar" aria-label="Ingresar/Modificar Familiar">
            <FamilyIcon />
            <span className="links_name">Ingresar/Modificar Familiar</span>
          </a>
          <span className="tooltip">Ingresar/Modificar Familiar</span>
        </li>

        <li className={current_url === '/list-pacientes' ? 'active' : ''}>
          <a href="./list-pacientes">
            <MedicalRecordIcon />
            <span className="links_name">Ficha Medica</span>
          </a>
          <span className="tooltip">Administrar Ficha Medica de Personas con EP</span>
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

        <li className={current_url === '/taller' ? 'active' : ''}>
          <a href="./taller" aria-label="Ingresar/Modificar taller">
            <ClipboardDataIcon />
            <span className="links_name">Ingresar/Modificar taller</span>
          </a>
          <span className="tooltip">Ingresar/Modificar taller</span>
        </li>

        <li className={current_url === '/encuentro' ? 'active' : ''}>
          <a href="./encuentro" aria-label="Ingresar/Modificar encuentro">
            <CalendarIcon />
            <span className="links_name">Ingresar/Modificar encuentro</span>
          </a>
          <span className="tooltip">Ingresar/Modificar encuentro</span>
        </li>

        <li className={current_url === '/asistencia' ? 'active' : ''}>
          <a href="./asistencia" aria-label="Registrar asistencia">
            <ClipboardCheckIcon />
            <span className="links_name">Registrar asistencia</span>
          </a>
          <span className="tooltip">Registrar asistencia</span>
        </li>

        <li className={current_url === '/consulta' ? 'active' : ''}>
          <a href="./consulta" aria-label="Consultas">
            <EyeIcon />
            <span className="links_name">Consultas</span>
          </a>
          <span className="tooltip">Consultas</span>
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
