import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from 'react-router-dom';
import { authRepository } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import logoTelepark from '../images/logo2022.png';
import styles from '../styles/login.module.css';

const Login = () => {
  const navigate = useNavigate();

  const [campo, setCampo] = useState({});
  const [loading, setLoading] = useState(false);

  // Valido los campos del formulario
  const validarFormulario = () => {
    let formularioValido = true;

    // user
    if (!campo['user']) {
      formularioValido = false;
    }

    // Pass
    if (!campo['pass']) {
      formularioValido = false;
    }

    return formularioValido;
  };

  // Una vez que los campos del formulario han sido llenado correctamente
  // Se envía la petición de autenticación al API
  const enviarFormulario = async (e) => {
    e.preventDefault();

    // Si la validación de los campos del formulario ha sido realizada
    if (validarFormulario()) {
      setLoading(true);

      try {
        const response = await authRepository.login({
          username: campo.user,
          password: campo.pass,
        });

        if (response) {
          TokenService.setUser(response.data);
          send();
        }
      } catch (error) {
        errorSend();
      } finally {
        setLoading(false);
      }
    } else {
      errorSend();
    }
  };

  // Detectamos cuando un campo del formulario es llenado y por ende cambia de estado
  const detectarCambio = (field, e) => {
    // Cambio de estado de campo — inmutable
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

    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  const errorSend = () => {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'No se permite el acceso',
      text: 'El nombre de usuario o la contraseña ingresada son incorrectos.',
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
