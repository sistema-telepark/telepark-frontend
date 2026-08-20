import React, { Suspense, lazy, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
// Imports estáticos (NO lazy) — se cargan siempre
import Sidebar from './components/sidebar.component';
import Footer from './components/footer.component';
import LoadingSpinner from './components/shared/loading-spinner';
import ProtectedRoute from './components/shared/protected-route';
import ErrorFallbackRoute from './components/error-boundary/error-fallback-route.component';
import { logError } from './components/error-boundary/logError';
import { TokenService } from './services/token.service';

// Lazy imports con webpackChunkName — se cargan bajo demanda
const Login = lazy(() => import(/* webpackChunkName: "login" */ './components/login.component'));
const AdminUsuarios = lazy(
  () => import(/* webpackChunkName: "admin-usuarios" */ './components/admin-users.component')
);
const AddPaciente = lazy(
  () => import(/* webpackChunkName: "add-paciente" */ './components/add-paciente.component')
);
const FichaMedica = lazy(
  () => import(/* webpackChunkName: "ficha-medica" */ './components/ficha-medica.component')
);
const ListaDiagnostico = lazy(
  () =>
    import(/* webpackChunkName: "lista-diagnostico" */ './components/list-diagnostico.component')
);
const ListaEvolucion = lazy(
  () => import(/* webpackChunkName: "lista-evolucion" */ './components/list-evolucion.component')
);
const ListaObraSocial = lazy(
  () => import(/* webpackChunkName: "lista-obrasocial" */ './components/list-obrasocial.component')
);
const ListaIndicacion = lazy(
  () => import(/* webpackChunkName: "lista-indicacion" */ './components/list-indicacion.component')
);
const Search = lazy(
  () => import(/* webpackChunkName: "search" */ './components/search-criteria.component')
);
const Events = lazy(
  () => import(/* webpackChunkName: "events" */ './components/gestion-eventos.component')
);
const TypeEvents = lazy(
  () => import(/* webpackChunkName: "type-events" */ './components/tipos-de-eventos.component')
);
const Nomenclador = lazy(
  () => import(/* webpackChunkName: "nomenclador" */ './components/nomenclador.component')
);
const ListaPaciente = lazy(
  () => import(/* webpackChunkName: "lista-pacientes" */ './components/list-pacientes-ep.component')
);
const Talleres = lazy(
  () => import(/* webpackChunkName: "talleres" */ './components/talleres.component')
);
const Encuentro = lazy(
  () => import(/* webpackChunkName: "encuentro" */ './components/encuentro.component')
);
const Actividad = lazy(
  () => import(/* webpackChunkName: "actividad" */ './components/actividad.component')
);
const Asistencia = lazy(
  () =>
    import(/* webpackChunkName: "asistencia-taller" */ './components/asistencia-taller.component')
);
const Consulta = lazy(
  () => import(/* webpackChunkName: "consulta" */ './components/consulta.component')
);
const Familiar = lazy(
  () => import(/* webpackChunkName: "familiar" */ './components/familiar.component')
);

function AppContent({ token, userName, userRole, setToken, setUserName, setUserRole }) {
  useEffect(() => {
    const handleAuthChange = () => {
      setToken(TokenService.getLocalAccessToken());
      setUserName(TokenService.getName());
      setUserRole(TokenService.getRole());
    };
    const handlePageShow = (event) => {
      if (event.persisted) handleAuthChange();
    };
    const handlePopState = () => handleAuthChange();

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setToken, setUserName, setUserRole]);

  return (
    <>
      {token ? (
        <span>
          <nav className="navbar navbar-expand navbar-light bg-light">
            <div className="container-fluid">
              <span className="navbar-text ms-auto">
                <b>Bienvenido: </b>
                {userName}
              </span>
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
                  <Suspense fallback={<LoadingSpinner />}>
                    <Login />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            {token && (
              <Route element={<ProtectedRoute />}>
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
                          <Suspense fallback={<LoadingSpinner />}>
                            <AdminUsuarios />
                          </Suspense>
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
                          <Suspense fallback={<LoadingSpinner />}>
                            <AddPaciente />
                          </Suspense>
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
                          <Suspense fallback={<LoadingSpinner />}>
                            <AddPaciente />
                          </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <FichaMedica />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaDiagnostico />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaEvolucion />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaObraSocial />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaIndicacion />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <Search />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaPaciente />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <Nomenclador />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <Events />
                      </Suspense>
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <TypeEvents />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/taller"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Talleres" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Talleres />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/encuentro"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Encuentro" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Encuentro />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/actividad"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Actividad" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Actividad />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/asistencia"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Asistencia" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Asistencia />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/consulta"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Consulta" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Consulta />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/familiar"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Familiar" />
                      )}
                      onError={logError}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Familiar />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              </Route>
            )}
            {!token && <Route path="*" element={<Navigate to="/" replace />} />}
          </Routes>
        </div>
      </div>

      {token ? <Footer /> : ''}
    </>
  );
}

AppContent.propTypes = {
  token: PropTypes.string,
  userName: PropTypes.string,
  userRole: PropTypes.bool,
  setToken: PropTypes.func.isRequired,
  setUserName: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
};

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
