import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/list-pacientes-ep.css';
import { userRepository } from '../services/users.service';
import { TokenService } from '../services/token.service';
import utils from '../utils/utils';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import styles from '../styles/admin-users.module.css';
import { showToast } from '../services/notification.service';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import { Form, Modal } from 'react-bootstrap';

const AdminUsuarios = () => {
  const [showNuevo, setShowNuevo] = useState(false);
  const [show, setShow] = useState(false);
  const [buscador, setBuscador] = useState('');
  const [usuarios, setUsuarios] = useState();
  const [usuariosFiltrados, setUsuariosFiltrados] = useState();
  const [idUsuario, setIdUsuario] = useState(null);
  const [usernameEditado, setUsernameEditado] = useState('');

  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const formNuevo = useForm();
  const formEdit = useForm();

  useEffect(() => {
    getUsers();
  }, []);

  const detectarCambioBuscador = (e) => {
    const valor = e.target.value;
    setBuscador(valor);
    buscar(valor);
    // Si el usuario vació el buscador (o apretó la cruz nativa 'X'), restauramos la lista completa
    if (valor.trim() === '') {
      setUsuariosFiltrados(undefined);
    }
  };

  // El backend devuelve envelope DRF paginado {count,next,previous,results}
  // → normalizar a .results.
  const getUsers = async () => {
    setLoading(true);
    setLoadError(null);
    let response = await userRepository.getUsers();

    if (response?.success && response?.data) {
      let admin = TokenService.getUsername();
      let users = (response.data.results ?? response.data).filter((user) => {
        return user.username !== admin;
      });
      setUsuarios(users);
      setUsuariosFiltrados(undefined);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar los usuarios.');
    }
    setLoading(false);
  };

  const editUser = (user) => {
    setShowNuevo(false);
    setShow(true);
    setIdUsuario(user.id);
    setUsernameEditado(user.username);
    formEdit.reset({
      username: user.username,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      role: user.is_superuser === true || user.is_superuser === 'true' ? 'true' : 'false',
      isActive: user.is_active === true ? 'true' : 'false',
    });
  };

  const eliminarUsuario = (usuario) => {
    setUsuarioAEliminar(usuario);
  };

  const confirmarEliminacion = async () => {
    const usuario = usuarioAEliminar;
    if (!usuario) return;
    setUsuarioAEliminar(null);
    const resp = await userRepository.deleteUser(usuario.id);
    if (resp.success) {
      showToast('success', 'Eliminado con éxito');
      setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
    }
  };

  const cancelarEliminacion = () => {
    setUsuarioAEliminar(null);
    showToast('danger', 'Cancelado', { message: 'No se eliminaron registros' });
  };

  const guardar = (data) => {
    if (!idUsuario) {
      showToast('danger', 'Error: Hubo un problema en la carga.');
      return;
    }

    setGuardando(true);
    const payload = {
      user: usernameEditado,
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      is_active: data.isActive === 'true' ? true : false,
      ...(data.password ? { password: data.password } : {}),
      ...(data.role ? { is_superuser: data.role === 'true' } : {}),
    };

    userRepository
      .updateUser(idUsuario, payload)
      .then((response) => {
        if (response && response.success) {
          showToast('success', 'Se ha guardado con éxito');
          clear();
          getUsers();
        }
      })
      .finally(() => setGuardando(false));
  };

  const guardarNuevo = (data) => {
    setGuardando(true);
    const payload = {
      user: data.username,
      email: data.email,
      first_name: data.firstname,
      last_name: data.lastname,
      password: data.password,
      is_superuser: data.role === 'true',
      is_active: data.isActive === 'true' ? true : false,
    };

    userRepository
      .createUser(payload)
      .then((response) => {
        if (response && response.success) {
          showToast('success', 'Se ha guardado con éxito');
          clear();
          getUsers();
        }
      })
      .finally(() => setGuardando(false));
  };

  const clear = () => {
    setShowNuevo(false);
    setShow(false);
    setIdUsuario(null);
    setUsernameEditado('');
    formNuevo.reset();
    formEdit.reset();
  };

  const agregar = () => {
    setShowNuevo(true);
    setShow(false);
    formNuevo.reset({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      role: '',
      isActive: '',
    });
  };

  // Filtra la lista de usuarios cargada en memoria; normaliza el término una
  // sola vez (case-insensitive) y busca sobre username, first_name y last_name.
  const buscar = (valor = buscador) => {
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
          e.preventDefault();
          buscar();
        }}
      >
        <div className={'mb-4 col-12 ' + styles.searchInputWrapper}>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar"
            id="buscador"
            aria-describedby="buscador"
            onChange={detectarCambioBuscador}
            value={buscador}
          />
        </div>
      </form>

      <Modal show={showNuevo}>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Agregar Usuario</h4>
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
                  {...formNuevo.register('firstname', {
                    required: 'Por favor, ingresa el nombre.',
                  })}
                />
                {formNuevo.formState.errors.firstname && (
                  <span className={styles.required} role="alert">
                    {formNuevo.formState.errors.firstname.message}
                  </span>
                )}
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
                  {...formNuevo.register('lastname', {
                    required: 'Por favor, ingresa el apellido.',
                  })}
                />
                {formNuevo.formState.errors.lastname && (
                  <span className={styles.required} role="alert">
                    {formNuevo.formState.errors.lastname.message}
                  </span>
                )}
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
                  {...formNuevo.register('email', {
                    required: 'Por favor, ingresa el email.',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Por favor, ingresa un email válido.',
                    },
                  })}
                />
                {formNuevo.formState.errors.email && (
                  <span className={styles.required} role="alert">
                    {formNuevo.formState.errors.email.message}
                  </span>
                )}
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6">
                <label className="col-form-label">
                  Nombre de Usuario <label className={styles.required}>*</label>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de usuario..."
                  id="username"
                  {...formNuevo.register('username', {
                    required: 'Por favor, ingresa el nombre de usuario.',
                  })}
                />
                {formNuevo.formState.errors.username && (
                  <span className={styles.required} role="alert">
                    {formNuevo.formState.errors.username.message}
                  </span>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6">
                <label className="col-form-label">
                  Contraseña <label className={styles.required}>*</label>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña..."
                  id="password"
                  {...formNuevo.register('password', {
                    required: 'Por favor, ingresa la contraseña.',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres.',
                    },
                  })}
                />
                {formNuevo.formState.errors.password && (
                  <span className={styles.required} role="alert">
                    {formNuevo.formState.errors.password.message}
                  </span>
                )}
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6">
                <label htmlFor="role" className="col-form-label">
                  Rol <label className={styles.required}>*</label>
                </label>
                <select
                  className="form-select"
                  placeholder="Ingrese rol..."
                  id="role"
                  {...formNuevo.register('role', {
                    required: 'Por favor, ingresa el role de usuario.',
                  })}
                >
                  <option value="">Elegir</option>
                  <option value="false">Usuario</option>
                  <option value="true">Administrador</option>
                </select>
                {formNuevo.formState.errors.role && (
                  <span className={styles.required} role="alert">
                    {formNuevo.formState.errors.role.message}
                  </span>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6">
                <label htmlFor="isActive" className="col-form-label">
                  Estado <label className={styles.required}>*</label>
                </label>
                <select
                  className="form-select"
                  placeholder="Ingrese estado..."
                  id="isActive"
                  {...formNuevo.register('isActive', {
                    required: 'Por favor, ingresa el estado.',
                  })}
                >
                  <option value="">Elegir</option>
                  <option value="false">Inactivo</option>
                  <option value="true">Activo</option>
                </select>
                {formNuevo.formState.errors.isActive && (
                  <span className={styles.required} role="alert">
                    {formNuevo.formState.errors.isActive.message}
                  </span>
                )}
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button
            type="submit"
            className={'btn btn-rojo ' + styles.cancelButton}
            onClick={() => clear()}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={'btn btn-verde ms-3 ' + styles.submitButton}
            onClick={() => formNuevo.handleSubmit(guardarNuevo)()}
            disabled={guardando}
          >
            {guardando && (
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
            )}
            {guardando ? 'Procesando...' : 'Guardar'}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={show}>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Editar Usuario</h4>
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
                  {...formEdit.register('firstname', {
                    required: 'Por favor, ingresa el nombre.',
                  })}
                />
                {formEdit.formState.errors.firstname && (
                  <span className={styles.required} role="alert">
                    {formEdit.formState.errors.firstname.message}
                  </span>
                )}
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
                  {...formEdit.register('lastname', {
                    required: 'Por favor, ingresa el apellido.',
                  })}
                />
                {formEdit.formState.errors.lastname && (
                  <span className={styles.required} role="alert">
                    {formEdit.formState.errors.lastname.message}
                  </span>
                )}
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
                  {...formEdit.register('email', {
                    required: 'Por favor, ingresa el email.',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Por favor, ingresa un email válido.',
                    },
                  })}
                />
                {formEdit.formState.errors.email && (
                  <span className={styles.required} role="alert">
                    {formEdit.formState.errors.email.message}
                  </span>
                )}
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6">
                <label className="col-form-label">
                  Nombre de Usuario <label className={styles.required}>*</label>
                </label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  placeholder="Nombre de usuario..."
                  id="username"
                  value={usernameEditado}
                />
              </div>
              <div className="mb-4 col-12 col-md-6">
                <label className="col-form-label">Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña..."
                  id="password"
                  {...formEdit.register('password', {
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres.',
                    },
                  })}
                />
                {formEdit.formState.errors.password && (
                  <span className={styles.required} role="alert">
                    {formEdit.formState.errors.password.message}
                  </span>
                )}
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6">
                <label htmlFor="role" className="col-form-label">
                  Rol <label className={styles.required}>*</label>
                </label>
                <select
                  className="form-select"
                  placeholder="Ingrese rol..."
                  id="role"
                  {...formEdit.register('role')}
                >
                  <option value="">Elegir</option>
                  <option value="false">Usuario</option>
                  <option value="true">Administrador</option>
                </select>
              </div>
              <div className="mb-4 col-12 col-md-6">
                <label htmlFor="isActive" className="col-form-label">
                  Estado <label className={styles.required}>*</label>
                </label>
                <select
                  className="form-select"
                  placeholder="Ingrese estado..."
                  id="isActive"
                  {...formEdit.register('isActive')}
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
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={'btn btn-verde ms-3 ' + styles.submitButton}
            onClick={() => formEdit.handleSubmit(guardar)()}
            disabled={guardando}
          >
            {guardando && (
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
            )}
            {guardando ? 'Procesando...' : 'Guardar'}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!usuarioAEliminar} onHide={cancelarEliminacion}>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Eliminar Usuario</h4>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Seguro que desea eliminar al usuario: <strong>{usuarioAEliminar?.username}</strong>?
          </p>
          <p className="text-danger mb-0">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button
            type="button"
            className={'btn btn-rojo ' + styles.cancelButton}
            onClick={cancelarEliminacion}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={'btn btn-verde ms-3 ' + styles.submitButton}
            onClick={confirmarEliminacion}
          >
            Sí
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
        {loading && <LoadingSpinner />}
        {loadError && (
          <ErrorFallbackInline
            error={{ message: loadError }}
            resetErrorBoundary={getUsers}
            message="No se pudieron cargar los usuarios. Intente nuevamente."
          />
        )}
      </div>
    </main>
  );
};

export default AdminUsuarios;
