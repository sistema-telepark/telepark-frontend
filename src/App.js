import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import AdminUsuarios from './components/admin-users.component';
import AddPaciente from './components/add-paciente.component';
import FichaMedica from './components/fichaMedica.component';
import ListaDiagnostico from './components/list-diagnostico.component';
import ListaEvolucion from './components/list-evolucion.component';
import ListaObraSocial from './components/list-obrasocial.component';
import ListaIndicacion from './components/list-indicacion.component';
import Footer from './components/footer.component';
import Login from './components/login.component';
import Search from './components/search-criteria.component';
import Events from './components/gestion-eventos.component';
import TypeEvents from './components/tipos-de-eventos.component';
import Nomenclador from './components/nomenclador.component';
import ListaPaciente from './components/list-pacientesEp.component';
import Sidebar from './components/sidebar.component';
import { TokenService } from './services/tokenService';

function AppContent({ token, userName, userRole, setToken, setUserName, setUserRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(TokenService.getLocalAccessToken());
      setUserName(TokenService.getName());
      setUserRole(TokenService.getRole());
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [setToken, setUserName, setUserRole]);

  const logout = () => {
    TokenService.removeUser();
    navigate('/');
  };

  return (
    <>
      {token ? (
        <span>
          <nav className="navbar navbar-expand navbar-light bg-light">
            <div className="container-fluid" style={{ justifyContent: 'right' }}>
              <h4 style={{ marginBottom: '0px' }}>
                <b>Bienvenido: </b>
                {userName}
              </h4>
            </div>
          </nav>

          <Sidebar />
        </span>
      ) : (
        ''
      )}
      <div className="container">
        <div className="row justify-content-center">
          <Routes>
            <Route path="/" element={<Login />} />
            {token && (
              <>
                {userRole === true ? (
                  <>
                    <Route path="/list-usuarios" element={<AdminUsuarios />} />
                    <Route path="/add-paciente" element={<AddPaciente />} />
                  </>
                ) : (
                  <>
                    <Route path="/add-paciente" element={<AddPaciente />} />
                  </>
                )}

                <Route path="/ficha" element={<FichaMedica />} />
                <Route path="/list-diagnostico" element={<ListaDiagnostico />} />
                <Route path="/list-evolucion" element={<ListaEvolucion />} />
                <Route path="/list-obrasocial" element={<ListaObraSocial />} />
                <Route path="/list-indicacion" element={<ListaIndicacion />} />
                <Route path="/search" element={<Search />} />
                <Route path="/list-pacientes" element={<ListaPaciente />} />
                <Route path="/nomenclador" element={<Nomenclador />} />
                <Route path="/events" element={<Events />} />
                <Route path="/type-events" element={<TypeEvents />} />
              </>
            )}
            {!token && <Route path="*" element={<Navigate to="/" replace />} />}
          </Routes>
        </div>
      </div>

      {token ? <Footer /> : ''}
    </>
  );
}

function App() {
  const [token, setToken] = useState(TokenService.getLocalAccessToken());
  const [userName, setUserName] = useState(TokenService.getName());
  const [userRole, setUserRole] = useState(TokenService.getRole());

  return (
    <Router>
      <AppContent
        token={token}
        userName={userName}
        userRole={userRole}
        setToken={setToken}
        setUserName={setUserName}
        setUserRole={setUserRole}
      />
    </Router>
  );
}

export default App;
