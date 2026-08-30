import React, { memo, useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from './icons/icons-shared';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import styles from '../styles/add-paciente.module.css';
import { eventRespository } from '../services/event.service';
import Swal from 'sweetalert2';
import { Form, Modal } from 'react-bootstrap';

const AdminPersonas = () => {
  const [arrayPerson, setArrayPerson] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [searchArrayperson, setSearchArrayperson] = useState({
    idpersona: 0,
    nombre: '',
    apellido: '',
    telefono: 0,
    borrado: 0,
  });
  const [modalEdit, setModalEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    getPersonAll();
  }, []);

  const handleChange = (e) => {
    setSearchArrayperson({
      ...searchArrayperson,
      [e.target.name]: e.target.value,
    });
  };

  const detectarCambioBusqueda = (e) => {
    setBuscar(e.target.value);
  };

  const edit = (data) => {
    let list = [...arrayPerson];
    let modifidedPerson = list.find((listdata) => data.idpersona === listdata.idpersona);
    if (!modifidedPerson) {
      return;
    }
    modifidedPerson = {
      id: data.idpersona,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      borrado: modifidedPerson.borrado,
    };
    eventRespository.updatePerson(data.idpersona, modifidedPerson).then((response) => {
      if (response?.success) {
        notificacionExito();
        clear();
        getPersonAll();
      }
    });
    setModalEdit(false);
  };

  const showModalEdit = (data) => {
    setModalEdit(true);
    setSearchArrayperson({
      idpersona: data.idpersona,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
    });
  };

  const handleModalEdit = () => {
    setModalEdit(false);
  };

  const clear = () => {
    setSearchArrayperson({
      idpersona: 0,
      nombre: '',
      apellido: '',
      telefono: 0,
      borrado: 0,
    });
  };

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

  const eliminar = (persona) => {
    let arrayPersonas = arrayPerson.filter(function (e) {
      return e.idpersona !== persona.idpersona;
    });
    persona.borrado = 1;
    Swal.fire({
      title: `¿Seguro que desea eliminar a  ${persona.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Si, Eliminar el a ${persona.nombre}`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado con exito!', `Se elimino a${persona.nombre}`, 'success');
        eventRespository.updatePerson(persona.idpersona, persona).then((response) => {
          if (response?.success) {
            notificacionExito();
            getPersonAll();
          }
        });
        setArrayPerson(arrayPersonas);
        setSearchArrayperson(arrayPerson);
      }
    });
  };

  const terminoBusqueda = buscar.trim().toLowerCase();
  const arrayPersonIspaciente = arrayPerson.filter((person) => {
    if (person.borrado === 1) return false;
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
                        className="btn btn-verde me-1"
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
        <Modal.Header>
          <div>
            <h2>Editar la persona con ep</h2>
          </div>
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
                onChange={handleChange}
                value={searchArrayperson.idpersona}
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
                onChange={handleChange}
                value={searchArrayperson.nombre}
              />
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
                onChange={handleChange}
                value={searchArrayperson.apellido}
              />
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
                onChange={handleChange}
                value={searchArrayperson.telefono}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-rojo"
            data-bs-dismiss="modal"
            onClick={() => handleModalEdit()}
          >
            Cancelar
          </button>
          <button type="button" className="btn btn-verde" onClick={() => edit(searchArrayperson)}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default memo(AdminPersonas);
