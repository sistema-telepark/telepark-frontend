import React, { Suspense, lazy, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';
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
const Home = lazy(() => import('./components/home.component'));
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
const AdminPersonas = lazy(
  () => import(/* webpackChunkName: "admin-personas" */ './components/admin-personas.component')
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
  const location = useLocation();
  const [retryKey, setRetryKey] = useState(0);
  const mostrarFooter = token && location.pathname !== '/home';

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
                  onReset={() => setRetryKey((k) => k + 1)}
                  resetKeys={[token]}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <Login key={retryKey} />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            {token && (
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/home"
                  element={
                    <ErrorBoundary
                      FallbackComponent={(props) => (
                        <ErrorFallbackRoute {...props} componentName="Home" />
                      )}
                      onError={logError}
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Home key={retryKey} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
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
                          onReset={() => setRetryKey((k) => k + 1)}
                          resetKeys={[token]}
                        >
                          <Suspense fallback={<LoadingSpinner />}>
                            <AdminUsuarios key={retryKey} />
                          </Suspense>
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="/add-paciente"
                      element={
                        <ErrorBoundary
                          FallbackComponent={(props) => (
                            <ErrorFallbackRoute {...props} componentName="AdminPersonas" />
                          )}
                          onError={logError}
                          onReset={() => setRetryKey((k) => k + 1)}
                          resetKeys={[token]}
                        >
                          <Suspense fallback={<LoadingSpinner />}>
                            <AdminPersonas key={retryKey} />
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
                            <ErrorFallbackRoute {...props} componentName="AdminPersonas" />
                          )}
                          onError={logError}
                          onReset={() => setRetryKey((k) => k + 1)}
                          resetKeys={[token]}
                        >
                          <Suspense fallback={<LoadingSpinner />}>
                            <AdminPersonas key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <FichaMedica key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaDiagnostico key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaEvolucion key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaObraSocial key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaIndicacion key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListaPaciente key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Nomenclador key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Events key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <TypeEvents key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Talleres key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Encuentro key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Actividad key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Asistencia key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Consulta key={retryKey} />
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
                      onReset={() => setRetryKey((k) => k + 1)}
                      resetKeys={[token]}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <Familiar key={retryKey} />
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

      {mostrarFooter ? <Footer /> : ''}
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
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
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
