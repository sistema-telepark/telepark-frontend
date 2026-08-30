import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from 'react-router';
import { authRepository } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { logAsyncError } from './error-boundary/logError';
import logoTelepark from '../images/logo2022.png';
import styles from '../styles/login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [campo, setCampo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const validarFormulario = () => {
    let formularioValido = true;

    if (!campo['user']) {
      formularioValido = false;
    }

    if (!campo['pass']) {
      formularioValido = false;
    }

    return formularioValido;
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      setLoading(true);

      try {
        const response = await authRepository.login({
          username: campo.user,
          password: campo.pass,
        });

        if (response) {
          TokenService.setUser(response);
          send();
        }
      } catch (error) {
        logAsyncError(error, { context: 'iniciar sesión' });
        errorSend(error);
      } finally {
        setLoading(false);
      }
    } else {
      errorSend();
    }
  };

  const detectarCambio = (field, e) => {
    setCampo({ ...campo, [field]: e.target.value });
  };

  const send = () => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Acceso Permitido',
      showConfirmButton: false,
      timer: 1500,
    });

    timerRef.current = setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  const errorSend = (error) => {
    const esCredenciales = error?.response?.status === 401;
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'No se permite el acceso',
      text: esCredenciales
        ? 'El nombre de usuario o la contraseña ingresada son incorrectos.'
        : 'Ocurrió un error al intentar iniciar sesión. Intente nuevamente.',
      confirmButtonText: 'OK',
    });

    setCampo({
      user: '',
      pass: '',
    });
  };

  if (TokenService.getLocalAccessToken()) return <Navigate to="/home" replace />;

  return (
    <div className="col-12 col-md-6 col-lg-5 col-xl-5">
      <form onSubmit={(e) => enviarFormulario(e)}>
        <main
          className={
            'border-top-sm row justify-content-center panel-gris shadow container-lg mx-auto ' +
            styles.formContainer
          }
        >
          <div className={'justify-content-center ' + styles.formCard}>
            <div className={'col-12 col-md-12 col-lg-12 col-xl-12 ' + styles.logoWrapper}>
              <img className={'logo ' + styles.logo} src={logoTelepark} alt="logo de telepark" />
            </div>
            <h2 className="mt-4 mt-md-2 text-center">Login</h2>
            <hr />
            <div className="container">
              <div className="row">
                <div className="w-100"></div>
                <div className={'col-12 col-md-12 col-lg-12 col-xl-12 ' + styles.formCenter}>
                  <label className={'col-form-label ' + styles.labelLeft}>Usuario</label>
                  <input
                    name="user"
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su usuario"
                    id="user"
                    aria-describedby="user"
                    onChange={(e) => detectarCambio('user', e)}
                    value={campo['user'] || ''}
                  />
                  <label className={'col-form-label ' + styles.labelPassword}>Contraseña</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Ingrese su Contraseña"
                    id="pass"
                    aria-describedby="pass"
                    onChange={(e) => detectarCambio('pass', e)}
                    value={campo['pass'] || ''}
                  />

                  <button
                    type="submit"
                    className={'btn btn-azul ' + styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
};

export default Login;
