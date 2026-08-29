import React, { useState, useEffect } from 'react';
import '../styles/list-pacientes-ep.css';
import { userRepository } from '../services/users.service';
import Swal from 'sweetalert2';
import { TokenService } from '../services/token.service';
import utils from '../utils/utils';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import styles from '../styles/admin-users.module.css';
import { showToast, showConfirm } from '../services/notification.service';
import { logAsyncError } from './error-boundary/logError';
import { Form, Modal } from 'react-bootstrap';

const AdminUsuarios = () => {
  const [showNuevo, setShowNuevo] = useState(false);
  const [show, setShow] = useState(false);
  const [campo, setCampo] = useState({
    buscador: '',
  });
  const [error, setError] = useState({});
  const [usuarios, setUsuarios] = useState();
  const [usuariosFiltrados, setUsuariosFiltrados] = useState();
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    let activo = true;
    getUsers(() => activo);
    return () => {
      activo = false;
    };
  }, []);

  // Función que obtiene los datos de los campos del formulario
  const detectarCambio = (field, e) => {
    // Cambio de estado de campo — inmutable
    setCampo({ ...campo, [field]: e.target.value });
    if (field === 'buscador') {
      buscar(e.target.value);
    }
    // Si el usuario vació el buscador (o apretó la cruz nativa 'X'), restauramos la lista completa
    if (field === 'buscador' && e.target.value.trim() === '') {
      setUsuariosFiltrados(undefined);
    }
  };

  // Valido los campos del formulario
  const validarFormulario = () => {
    let error = {};
    let formularioValido = true;

    if (showNuevo) {
      if (!campo['username']) {
        formularioValido = false;
        error['username'] = 'Por favor, ingresa el nombre de usuario.';
      }

      if (!campo['firstname']) {
        formularioValido = false;
        error['firstname'] = 'Por favor, ingresa el nombre.';
      }

      if (!campo['lastname']) {
        formularioValido = false;
        error['lastname'] = 'Por favor, ingresa el apellido.';
      }

      if (!campo['password']) {
        formularioValido = false;
        error['password'] = 'Por favor, ingresa la contraseña.';
      } else if (campo['password'].length < 8) {
        formularioValido = false;
        error['password'] = 'La contraseña debe tener al menos 8 caracteres.';
      }

      if (!campo['role']) {
        formularioValido = false;
        error['role'] = 'Por favor, ingresa el role de usuario.';
      }

      if (!campo['isActive']) {
        formularioValido = false;
        error['isActive'] = 'Por favor, ingresa el estado.';
      }

      if (!campo['email']) {
        formularioValido = false;
        error['email'] = 'Por favor, ingresa el email.';
      } else if (!/^\S+@\S+\.\S+$/.test(campo['email'])) {
        formularioValido = false;
        error['email'] = 'Por favor, ingresa un email válido.';
      }
    } else {
      if (!campo['firstname']) {
        formularioValido = false;
        error['firstname'] = 'Por favor, ingresa el nombre.';
      }

      if (!campo['lastname']) {
        formularioValido = false;
        error['lastname'] = 'Por favor, ingresa el apellido.';
      }

      if (!campo['email']) {
        formularioValido = false;
        error['email'] = 'Por favor, ingresa el email.';
      } else if (!/^\S+@\S+\.\S+$/.test(campo['email'])) {
        formularioValido = false;
        error['email'] = 'Por favor, ingresa un email válido.';
      }

      if (campo['password'] && campo['password'].length < 8) {
        formularioValido = false;
        error['password'] = 'La contraseña debe tener al menos 8 caracteres.';
      }
    }

    // Seteo el estado de error
    setError(error);

    return formularioValido;
  };

  // Función que obtiene la lista de usuarios
  // M01 (HITL 2026-08-11): /usuarios devuelve envelope DRF paginado
  // {count,next,previous,results} → normalizar a .results (patrón RA-13).
  const getUsers = async (isActivo = () => true) => {
    let response = await userRepository.getUsers();

    if (!isActivo()) return;
    if (response && response.data) {
      let admin = TokenService.getUsername();
      let users = (response.data.results ?? response.data).filter((user) => {
        return user.username !== admin;
      });
      setUsuarios(users);
      setUsuariosFiltrados(undefined);
    }
  };

  const editUser = (user) => {
    setShowNuevo(false);
    setShow(true);
    setIdUsuario(user.id);
    setCampo({
      buscador: '',
      username: user.username,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      role: user.is_superuser === true || user.is_superuser === 'true' ? 'true' : 'false',
      isActive: user.is_active === true ? 'true' : 'false',
    });
    setError('');
  };

  const eliminarUsuario = async (usuario) => {
    const ok = await showConfirm(`¿Seguro que desea eliminar al usuario: ${usuario.username}?`);
    if (!ok) return;
    const resp = await userRepository.deleteUser(usuario.id);
    if (resp.success) {
      showToast('success', 'Eliminado con éxito');
      setUsuarios(usuarios.filter((u) => u.id !== usuario.id));
    }
  };

  const guardar = () => {
    if (!idUsuario) {
      notificacionError();
      return;
    }

    let data = {};
    if (validarFormulario()) {
      cargando();
      if (!campo['password']) {
        data = {
          user: campo.username,
          first_name: campo.firstname,
          last_name: campo.lastname,
          email: campo.email,
          is_active: campo.isActive === 'true' ? true : false,
          ...(campo.role ? { is_superuser: campo.role === 'true' } : {}),
        };
      } else {
        data = {
          user: campo.username,
          first_name: campo.firstname,
          last_name: campo.lastname,
          email: campo.email,
          password: campo.password,
          is_active: campo.isActive === 'true' ? true : false,
          ...(campo.role ? { is_superuser: campo.role === 'true' } : {}),
        };
      }

      userRepository
        .updateUser(idUsuario, data)
        .then((response) => {
          if (response && response.success) {
            notificacionExito();
            clear();
            getUsers();
          }
        })
        .catch((error) => logAsyncError(error, { context: 'actualizar usuario' }));
    }
  };

  const guardarNuevo = () => {
    let data = {};
    if (validarFormulario()) {
      cargando();
      data = {
        user: campo.username,
        email: campo.email,
        first_name: campo.firstname,
        last_name: campo.lastname,
        password: campo.password,
        is_superuser: campo.role === 'true',
        is_active: campo.isActive === 'true' ? true : false,
      };

      userRepository
        .createUser(data)
        .then((response) => {
          if (response && response.success) {
            notificacionExito();
            clear();
            getUsers();
          }
        })
        .catch((error) => logAsyncError(error, { context: 'crear usuario' }));
    }
  };

  const clear = () => {
    setShowNuevo(false);
    setShow(false);
    setIdUsuario(null);
    setCampo({
      buscador: '',
      password: '',
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      role: '',
      isActive: '',
    });
  };

  const agregar = () => {
    setShowNuevo(true);
    setShow(false);
    setError('');
    setCampo({
      buscador: '',
      password: '',
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      role: '',
      isActive: '',
    });
  };

  //notificaciones
  const notificacionExito = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Se ha guardado con éxito',
    });
  };

  //notificaciones
  const notificacionError = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'error',
      title: 'Error: Hubo un problema en la carga.',
    });
  };

  // Loader
  const cargando = () => {
    Swal.fire({
      title: 'Espere...',
      html: 'Procesando su solicitud.',
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        // Cerrando loader
      },
    });
  };

  // Función buscar: filtra la lista de usuarios cargada en memoria (client-side, RF-05).
  // Normaliza el término una sola vez (case-insensitive) y busca sobre username,
  // first_name y last_name (campos declarados en el contrato del backend).
  const buscar = (valor = campo.buscador) => {
    const termino = (valor || '').trim().toLowerCase();
    if (!usuarios) return;
    if (termino === '') {
      setUsuariosFiltrados(undefined);
      return;
    }
    const filtrados = usuarios.filter(
      (u) =>
        (u.username || '').toLowerCase().includes(termino) ||
        (u.first_name || '').toLowerCase().includes(termino) ||
        (u.last_name || '').toLowerCase().includes(termino)
    );
    setUsuariosFiltrados(filtrados);
  };

  // Lista visible: la filtrada por el buscador o la completa.
  const listaVisible = usuariosFiltrados !== undefined ? usuariosFiltrados : usuarios;
  return (
    <main className="border-top-sm m-0 justify-content-center m-md-3 rounded shadow container-lg mx-md-auto panel-gris">
      <h2 className="mt-4 text-center">Administrar Usuarios</h2>
      <hr />
      <button type="button" className="btn btn-azul mb-2 mt-2" onClick={() => agregar()}>
        <PlusIcon className="signoMas" />
        Agregar
      </button>
      <form
        className="row align-items-center mt-2"
        onSubmit={(e) => {
          e.preventDefault(); // Evita que la página web se recargue por completo
          buscar(); // Llama a tu función de búsqueda existente
        }}
      >
        <div className={'mb-4 col-12 ' + styles.searchInputWrapper}>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar"
            id="buscador"
            aria-describedby="buscador"
            onChange={(e) => detectarCambio('buscador', e)}
            value={campo['buscador'] || ''}
          />
        </div>
      </form>

      <Modal show={showNuevo}>
        <Modal.Header>
          <h4>
            Agregar Usuario <span className={styles.required}>(*) Campos Requeridos</span>
          </h4>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Nombre <label className={styles.required}>*</label>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre..."
                  id="firstname"
                  onChange={(e) => detectarCambio('firstname', e)}
                  value={campo['firstname'] || ''}
                />
                <span className={styles.required}>{error['firstname']}</span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Apellido <label className={styles.required}>*</label>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apellido..."
                  id="lastname"
                  onChange={(e) => detectarCambio('lastname', e)}
                  value={campo['lastname'] || ''}
                />
                <span className={styles.required}>{error['lastname']}</span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Email <label className={styles.required}>*</label>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email..."
                  id="email"
                  onChange={(e) => detectarCambio('email', e)}
                  value={campo['email'] || ''}
                />
                <span className={styles.required}>{error['email']}</span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Nombre de Usuario <label className={styles.required}>*</label>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de usuario..."
                  id="username"
                  onChange={(e) => detectarCambio('username', e)}
                  value={campo['username'] || ''}
                />
                <span className={styles.required}>{error['username']}</span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Contraseña <label className={styles.required}>*</label>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña..."
                  id="password"
                  onChange={(e) => detectarCambio('password', e)}
                  value={campo['password'] || ''}
                />
                <span className={styles.required} role="alert">
                  {error['password']}
                </span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label htmlFor="role" className="col-form-label">
                  Rol <label className={styles.required}>*</label>
                </label>
                <select
                  className="form-select"
                  placeholder="Ingrese rol..."
                  id="role"
                  onChange={(e) => detectarCambio('role', e)}
                  value={campo['role'] || ''}
                >
                  <option value="">Elegir</option>
                  <option value="false">Usuario</option>
                  <option value="true">Administrador</option>
                </select>
                <span className={styles.required}>{error['role']}</span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label htmlFor="isActive" className="col-form-label">
                  Estado <label className={styles.required}>*</label>
                </label>
                <select
                  className="form-select"
                  placeholder="Ingrese estado..."
                  id="isActive"
                  onChange={(e) => detectarCambio('isActive', e)}
                  value={campo['isActive'] || ''}
                >
                  <option value="">Elegir</option>
                  <option value="false">Inactivo</option>
                  <option value="true">Activo</option>
                </select>
                <span className={styles.required}>{error['isActive']}</span>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button
            type="submit"
            className={'btn btn-rojo ' + styles.cancelButton}
            onClick={() => clear()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={'btn btn-verde ms-3 ' + styles.submitButton}
            onClick={() => guardarNuevo()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={show}>
        <Modal.Header>
          <h4>
            Editar Usuario <span className={styles.required}>(*) Campos Requeridos</span>
          </h4>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Nombre <label className={styles.required}>*</label>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre..."
                  id="firstname"
                  onChange={(e) => detectarCambio('firstname', e)}
                  value={campo['firstname'] || ''}
                />
                <span className={styles.required}>{error['firstname']}</span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Apellido <label className={styles.required}>*</label>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apellido..."
                  id="lastname"
                  onChange={(e) => detectarCambio('lastname', e)}
                  value={campo['lastname'] || ''}
                />
                <span className={styles.required}>{error['lastname']}</span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Email <label className={styles.required}>*</label>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email..."
                  id="email"
                  onChange={(e) => detectarCambio('email', e)}
                  value={campo['email'] || ''}
                />
                <span className={styles.required}>{error['email']}</span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">
                  Nombre de Usuario <label className={styles.required}>*</label>
                </label>
                <input
                  type="text"
                  disabled="true"
                  className="form-control"
                  placeholder="Nombre de usuario..."
                  id="username"
                  onChange={(e) => detectarCambio('username', e)}
                  value={campo['username'] || ''}
                />
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña..."
                  id="password"
                  onChange={(e) => detectarCambio('password', e)}
                  value={campo['password'] || ''}
                />
                <span className={styles.required} role="alert">
                  {error['password']}
                </span>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label htmlFor="role" className="col-form-label">
                  Rol <label className={styles.required}>*</label>
                </label>
                <select
                  className="form-select"
                  placeholder="Ingrese rol..."
                  id="role"
                  onChange={(e) => detectarCambio('role', e)}
                  value={campo['role'] || ''}
                >
                  <option value="">Elegir</option>
                  <option value="false">Usuario</option>
                  <option value="true">Administrador</option>
                </select>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label htmlFor="isActive" className="col-form-label">
                  Estado <label className={styles.required}>*</label>
                </label>
                <select
                  className="form-select"
                  placeholder="Ingrese estado..."
                  id="isActive"
                  onChange={(e) => detectarCambio('isActive', e)}
                  value={campo['isActive'] || ''}
                >
                  <option value="false">Inactivo</option>
                  <option value="true">Activo</option>
                </select>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button
            type="submit"
            className={'btn btn-rojo ' + styles.cancelButton}
            onClick={() => clear()}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={'btn btn-verde ms-3 ' + styles.submitButton}
            onClick={() => guardar()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      <div className="row">
        <div className={'col-12 col-md-12 col-lg-12 col-xl-12 ' + styles.tableWrapper}>
          <table
            className={
              'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
            }
          >
            <thead>
              <tr>
                <th scope="col">Usuario</th>
                <th scope="col">Nombre completo</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody className={styles.tableBodyMiddle}>
              {listaVisible &&
                listaVisible.map((usuario, _index) => (
                  <tr key={usuario.id ?? usuario.username}>
                    <td>{usuario.username}</td>
                    <td>
                      {usuario.first_name} {usuario.last_name}
                    </td>
                    <td>{utils.convertRole(usuario.is_superuser)}</td>
                    <td>{utils.convertStateUser(usuario.is_active)}</td>

                    <td>
                      <button
                        type="button"
                        className={'btn btn-verde ' + styles.rowActionButton}
                        onClick={() => editUser(usuario)}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        className={'btn btn-rojo ' + styles.rowActionButton}
                        onClick={() => eliminarUsuario(usuario)}
                        aria-label={`Eliminar usuario ${usuario.username}`}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminUsuarios;
