import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
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
import ErrorFallbackRoute from './components/error-boundary/ErrorFallbackRoute';
import { logError } from './components/error-boundary/logError';

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
            <Route
              path="/"
              element={
                <ErrorBoundary
                  FallbackComponent={(props) => (
                    <ErrorFallbackRoute {...props} componentName="Login" />
                  )}
                  onError={logError}
                  resetKeys={[token]}
                >
                  <Login />
                </ErrorBoundary>
              }
            />
            {token && (
              <>
                {userRole === true ? (
                  <>
                    <Route
                      path="/list-usuarios"
                      element={
                        <ErrorBoundary
                          FallbackComponent={(props) => (
                            <ErrorFallbackRoute {...props} componentName="AdminUsuarios" />
                          )}
                          onError={logError}
                          resetKeys={[token]}
                        >
                          <AdminUsuarios />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/add-paciente"
                      element={
                        <ErrorBoundary
                          FallbackComponent={(props) => (
                            <ErrorFallbackRoute {...props} componentName="AddPaciente" />
                          )}
                          onError={logError}
                          resetKeys={[token]}
                        >
                          <AddPaciente />
                        </ErrorBoundary>
                      }
                    />
                  </>
                ) : (
                  <>
                    <Route
                      path="/add-paciente"
                      element={
                        <ErrorBoundary
                          FallbackComponent={(props) => (
                            <ErrorFallbackRoute {...props} componentName="AddPaciente" />
                          )}
                          onError={logError}
                          resetKeys={[token]}
                        >
                          <AddPaciente />
                        </ErrorBoundary>
                      }
                    />
                  </>
                )}

                <Route
                  path="/ficha"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="FichaMedica" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <FichaMedica />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/list-diagnostico"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="ListaDiagnostico" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <ListaDiagnostico />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/list-evolucion"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="ListaEvolucion" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <ListaEvolucion />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/list-obrasocial"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="ListaObraSocial" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <ListaObraSocial />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/list-indicacion"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="ListaIndicacion" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <ListaIndicacion />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Search" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Search />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/list-pacientes"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="ListaPaciente" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <ListaPaciente />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/nomenclador"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Nomenclador" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Nomenclador />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Events" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Events />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/type-events"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="TypeEvents" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <TypeEvents />
                    </ErrorBoundary>
                  }
                />
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
