import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

class App extends Component {
  //arrow function para logout
  logout = () => {
    TokenService.removeUser();
    window.location.href = '/';
  };

  render() {
    const token = TokenService.getLocalAccessToken();
    const user_name = TokenService.getName();
    const user_role = TokenService.getRole();
    return (
      <Router>
        {token ? (
          <span>
            <nav className="navbar navbar-expand navbar-light bg-light">
              <div className="container-fluid" style={{ justifyContent: 'right' }}>
                <h4 style={{ marginBottom: '0px' }}>
                  <b>Bienvenido: </b>
                  {user_name}
                </h4>
              </div>
            </nav>

            <Sidebar></Sidebar>
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
                  {user_role === true ? (
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
      </Router>
    );
  }
}

export default App;
