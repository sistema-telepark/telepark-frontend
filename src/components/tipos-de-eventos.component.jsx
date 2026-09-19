import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form, Modal } from 'react-bootstrap';
import { eventRespository } from '../services/event.service';
import { showConfirm, showToast } from '../services/notification.service';
import { PencilIcon, PlusIcon, TrashIcon } from './icons/icons-shared';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';

const TypeEvents = () => {
  const [typeEvent, setTypeEvent] = useState([]);

  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const formInsert = useForm();
  const formEdit = useForm();

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    getEventAll()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recargar = () => {
    setLoadError(null);
    getEventAll().catch(() => {});
  };

  const showModalInsert = () => {
    formInsert.reset({ nombre: '', desactivataller: false });
    setModalInsert(true);
  };

  const handleModalInsert = () => {
    formInsert.reset();
    setModalInsert(false);
  };

  const showModalEdit = (data) => {
    formEdit.reset({
      idtipoevento: data.idtipoevento,
      nombre: data.nombre,
      desactivataller: data.desactivataller,
    });
    setModalEdit(true);
  };

  const handleModalEdit = () => {
    formEdit.reset();
    setModalEdit(false);
  };

  const deleteTypeEvent = async (data) => {
    let modifidedEvent = {
      borrado: true,
    };
    return eventRespository.updateTypeEvent(data.idtipoevento, modifidedEvent);
  };

  const handleDelete = async (data) => {
    const confirmado = await showConfirm({
      title: `¿Seguro que desea eliminar el tipo de evento ${data.nombre}?`,
      confirmLabel: 'Sí',
      variant: 'warning',
    });
    if (!confirmado) {
      showToast('danger', 'Cancelado', { message: 'No se eliminaron registros' });
      return;
    }
    const response = await deleteTypeEvent(data);
    if (response?.success) {
      showToast('success', 'Eliminado con éxito');
    }
    setTypeEvent((prev) => prev.filter((item) => item.idtipoevento !== data.idtipoevento));
  };

  const edit = (data) => {
    const payload = {
      id: data.idtipoevento,
      nombre: data.nombre,
      desactivataller: data.desactivataller,
      borrado: false,
    };

    eventRespository.updateTypeEvent(data.idtipoevento, payload).then((response) => {
      if (response?.success) {
        showToast('success', 'Se ha guardado con éxito');
        clear();
        getEventAll();
      }
    });
    setModalEdit(false);
  };

  const guardarNuevo = (data) => {
    const payload = {
      nombre: data.nombre,
      desactivataller: data.desactivataller,
      borrado: false,
    };
    eventRespository.createTypeEvent(payload).then((response) => {
      if (response?.success) {
        setModalInsert(false);
        showToast('success', 'Se ha guardado con éxito');
        clear();
        getEventAll();
      }
    });
  };
  const getEventAll = async () => {
    let response = await eventRespository.getEventAll();
    if (response?.success && response?.data) {
      setTypeEvent(response.data);
      setLoadError(null);
    } else {
      setLoadError(response.error);
    }
  };

  const clear = () => {
    formInsert.reset();
    formEdit.reset();
  };

  return (
    <>
      <Container className="container panel-gris">
        <h2 className="mt-4 text-center">Tipos de eventos</h2>
        <hr />
        <button className="btn btn-azul mb-2 mt-2" onClick={() => showModalInsert()}>
          <PlusIcon className="signoMas" /> Agregar
        </button>
        <div className="row m-md-3 shadow mx-md-auto border-top-sm m-0">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Desactivar Taller</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {typeEvent
                .filter((element) => element.borrado === false)
                .map((element) => (
                  <tr key={element.idtipoevento}>
                    <td>{element.idtipoevento}</td>
                    <td>{element.nombre}</td>
                    <td>
                      <input
                        disabled={true}
                        type="checkbox"
                        checked={element.desactivataller}
                        className="form-check-input"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-verde me-2"
                        onClick={() => showModalEdit(element)}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-rojo"
                        onClick={() => handleDelete(element)}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Container>

      {loading && <LoadingSpinner />}
      {loadError && (
        <ErrorFallbackInline
          error={{ message: loadError }}
          resetErrorBoundary={recargar}
          message="Error al cargar los tipos de evento. Intente nuevamente."
        />
      )}

      <Modal show={modalInsert}>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Nuevo tipo de evento</h4>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-0">
            <label htmlFor="nombre" className="control-label">
              Nombre:
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              className="form-control"
              {...formInsert.register('nombre', { required: 'Debe ingresar el nombre.' })}
            />
            {formInsert.formState.errors.nombre && (
              <span className="text-danger" role="alert">
                {formInsert.formState.errors.nombre.message}
              </span>
            )}
          </Form.Group>
          <Form.Group className="mb-0">
            <label htmlFor="desactivataller" className="control-label">
              Desactivar taller:
            </label>
            <input
              type="checkbox"
              name="desactivataller"
              id="desactivataller"
              className="form-check-input"
              {...formInsert.register('desactivataller')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-rojo" onClick={() => handleModalInsert()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde ms-3"
            onClick={() => formInsert.handleSubmit(guardarNuevo)()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalEdit}>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Editar tipo de evento</h4>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-0">
              <label htmlFor="idtipoevento" className="control-label">
                ID:
              </label>
              <input
                type="text"
                name="idtipoevento"
                id="idtipoevento"
                className="form-control"
                readOnly
                {...formEdit.register('idtipoevento')}
              />
            </Form.Group>
            <Form.Group className="mb-0">
              <label htmlFor="nombre" className="control-label">
                Nombre de tipo de evento:
              </label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                className="form-control"
                {...formEdit.register('nombre', { required: 'Debe ingresar el nombre.' })}
              />
              {formEdit.formState.errors.nombre && (
                <span className="text-danger" role="alert">
                  {formEdit.formState.errors.nombre.message}
                </span>
              )}
            </Form.Group>
            <Form.Group className="mb-0">
              <label htmlFor="desactivataller" className="control-label">
                Desactivar taller:
              </label>
              <input
                type="checkbox"
                name="desactivataller"
                id="desactivataller"
                className="form-check-input"
                {...formEdit.register('desactivataller')}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-rojo" onClick={() => handleModalEdit()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde ms-3"
            onClick={() => formEdit.handleSubmit(edit)()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default TypeEvents;
