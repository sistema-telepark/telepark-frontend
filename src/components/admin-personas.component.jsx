import React, { memo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PencilIcon, TrashIcon } from './icons/icons-shared';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import styles from '../styles/add-paciente.module.css';
import { eventRespository } from '../services/event.service';
import { showConfirm, showToast } from '../services/notification.service';
import { Form, Modal } from 'react-bootstrap';

const AdminPersonas = () => {
  const [arrayPerson, setArrayPerson] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [modalEdit, setModalEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const formEdit = useForm();

  useEffect(() => {
    getPersonAll();
  }, []);

  const detectarCambioBusqueda = (e) => {
    setBuscar(e.target.value);
  };

  const edit = (data) => {
    let list = [...arrayPerson];
    let modifidedPerson = list.find((listdata) => Number(data.idpersona) === listdata.idpersona);
    if (!modifidedPerson) {
      return;
    }
    modifidedPerson = {
      id: Number(data.idpersona),
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      borrado: modifidedPerson.borrado,
    };
    eventRespository.updatePerson(Number(data.idpersona), modifidedPerson).then((response) => {
      if (response?.success) {
        showToast('success', 'Se ha guardado con éxito');
        clear();
        getPersonAll();
      }
    });
    setModalEdit(false);
  };

  const showModalEdit = (data) => {
    setModalEdit(true);
    formEdit.reset({
      idpersona: data.idpersona,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
    });
  };

  const handleModalEdit = () => {
    formEdit.reset();
    setModalEdit(false);
  };

  const clear = () => {
    formEdit.reset();
  };

  // El backend responde envelope DRF paginado {count,next,previous,results}
  // → normalizar a .results.
  const getPersonAll = async () => {
    setLoading(true);
    setLoadError(null);
    let response = await eventRespository.getAll();
    if (response?.success && response?.data) {
      setArrayPerson(response.data.results ?? response.data);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar las personas.');
    }
    setLoading(false);
  };

  const eliminar = async (persona) => {
    const confirmado = await showConfirm({
      title: `¿Seguro que desea eliminar a  ${persona.nombre}?`,
      confirmLabel: `Sí`,
      variant: 'warning',
    });
    if (!confirmado) {
      showToast('danger', 'Cancelado', { message: 'No se eliminaron registros' });
      return;
    }
    const arrayPersonas = arrayPerson.filter((e) => e.idpersona !== persona.idpersona);
    persona.borrado = true;
    eventRespository.updatePerson(persona.idpersona, persona).then((response) => {
      if (response?.success) {
        showToast('success', 'Eliminado con éxito');
        getPersonAll();
      }
    });
    setArrayPerson(arrayPersonas);
  };

  const terminoBusqueda = buscar.trim().toLowerCase();
  const arrayPersonIspaciente = arrayPerson.filter((person) => {
    if (person.borrado === true) return false;
    if (!terminoBusqueda) return true;

    return [person.idpersona, person.nombre, person.apellido, person.telefono]
      .filter((value) => value !== null && value !== undefined)
      .some((value) => String(value).toLowerCase().includes(terminoBusqueda));
  });

  return (
    <>
      <main className="border-top-sm m-0 justify-content-center m-md-3 rounded shadow container-lg mx-md-auto panel-gris">
        <h2 className="mt-4 text-center">Personas</h2>
        <hr />
        <form
          className="row align-items-center mt-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={'mb-4 col-12 ' + styles.searchInputWrapper}>
            <input
              type="search"
              className="form-control"
              placeholder="Buscar"
              id="buscador-personas-ep"
              aria-label="Buscar personas con EP"
              onChange={detectarCambioBusqueda}
              value={buscar}
            />
          </div>
        </form>
        <div className="row">
          <div className={'col-12 col-md-12 col-lg-12 col-xl-12 ' + styles.tableWrapper}>
            <table
              className={
                'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
              }
            >
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Telefono</th>
                  <th scope="col">Accion</th>
                </tr>
              </thead>
              <tbody>
                {arrayPersonIspaciente.map((person) => (
                  <tr key={person.idpersona}>
                    <th scope="row">{person.idpersona}</th>
                    <td>{person.nombre}</td>
                    <td>{person.apellido}</td>
                    <td>{person.telefono}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-verde me-2"
                        onClick={() => showModalEdit(person)}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-rojo me-1"
                        onClick={() => eliminar(person)}
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
        {loading && <LoadingSpinner />}
        {loadError && (
          <ErrorFallbackInline
            error={{ message: loadError }}
            resetErrorBoundary={getPersonAll}
            message="No se pudieron cargar las personas. Intente nuevamente."
          />
        )}
      </main>

      <Modal show={modalEdit}>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Editar Persona</h4>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-0">
              <label htmlFor="idpersona" className="control-label">
                ID de la persona
              </label>
              <input
                type="text"
                name="idpersona"
                id="idpersona"
                className="form-control"
                readOnly
                {...formEdit.register('idpersona')}
              />
            </Form.Group>
            <Form.Group className="mb-0">
              <label htmlFor="nombre" className="control-label">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                className="form-control"
                {...formEdit.register('nombre', { required: 'Por favor, ingresa el nombre.' })}
              />
              {formEdit.formState.errors.nombre && (
                <span className="text-danger" role="alert">
                  {formEdit.formState.errors.nombre.message}
                </span>
              )}
            </Form.Group>
            <Form.Group className="mb-0">
              <label htmlFor="apellido" className="control-label">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                id="apellido"
                className="form-control"
                {...formEdit.register('apellido', { required: 'Por favor, ingresa el apellido.' })}
              />
              {formEdit.formState.errors.apellido && (
                <span className="text-danger" role="alert">
                  {formEdit.formState.errors.apellido.message}
                </span>
              )}
            </Form.Group>
            <Form.Group className="mb-0">
              <label htmlFor="telefono" className="control-label">
                Telefono
              </label>
              <input
                type="text"
                name="telefono"
                id="telefono"
                className="form-control"
                {...formEdit.register('telefono', { required: 'Por favor, ingresa el teléfono.' })}
              />
              {formEdit.formState.errors.telefono && (
                <span className="text-danger" role="alert">
                  {formEdit.formState.errors.telefono.message}
                </span>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-rojo" onClick={() => handleModalEdit()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde"
            onClick={() => formEdit.handleSubmit(edit)()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default memo(AdminPersonas);
