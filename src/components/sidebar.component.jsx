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

        <li className={current_url === '/list-pacientes' ? 'active' : ''}>
          <a href="./list-pacientes">
            <MedicalRecordIcon />
            <span className="links_name">Ficha Médica</span>
          </a>
          <span className="tooltip">Ficha Médica</span>
        </li>

        <li className={current_url === '/familiar' ? 'active' : ''}>
          <a href="./familiar" aria-label="Ingresar/Modificar Familiar">
            <FamilyIcon />
            <span className="links_name">Familiares</span>
          </a>
          <span className="tooltip">Familiares</span>
        </li>

        <li className={current_url === '/add-paciente' ? 'active' : ''}>
          <a href="./add-paciente">
            <SearchSidebarIcon />
            <span className="links_name">Buscar Personas</span>
          </a>
          <span className="tooltip">Buscar Personas</span>
        </li>

        <li className={current_url === '/nomenclador' ? 'active' : ''}>
          <a href="./nomenclador">
            <NomencladorIcon />
            <span className="links_name">Nomencladores</span>
          </a>
          <span className="tooltip">Nomencladores</span>
        </li>

        <li className={current_url === '/type-events' ? 'active' : ''}>
          <a href="./type-events">
            <TableIcon />
            <span className="links_name">Tipos de evento</span>
          </a>
          <span className="tooltip">Tipos de evento</span>
        </li>

        <li className={current_url === '/events' ? 'active' : ''}>
          <a href="./events">
            <CalendarIcon />
            <span className="links_name">Eventos</span>
          </a>
          <span className="tooltip">Eventos</span>
        </li>

        <li className={current_url === '/taller' ? 'active' : ''}>
          <a href="./taller" aria-label="Ingresar/Modificar taller">
            <ClipboardDataIcon />
            <span className="links_name">Talleres</span>
          </a>
          <span className="tooltip">Talleres</span>
        </li>

        <li className={current_url === '/encuentro' ? 'active' : ''}>
          <a href="./encuentro" aria-label="Ingresar/Modificar encuentro">
            <CalendarIcon />
            <span className="links_name">Encuentros</span>
          </a>
          <span className="tooltip">Encuentros</span>
        </li>

        <li className={current_url === '/asistencia' ? 'active' : ''}>
          <a href="./asistencia" aria-label="Registrar asistencia">
            <ClipboardCheckIcon />
            <span className="links_name">Asistencias</span>
          </a>
          <span className="tooltip">Asistencias</span>
        </li>

        <li className={current_url === '/consulta' ? 'active' : ''}>
          <a href="./consulta" aria-label="Consultas">
            <EyeIcon />
            <span className="links_name">Consultas</span>
          </a>
          <span className="tooltip">Consultas</span>
        </li>

        <hr className="hr_sidebar"></hr>
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
