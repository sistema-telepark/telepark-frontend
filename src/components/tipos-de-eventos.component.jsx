import React, { useState, useEffect } from 'react';
import { Container, Form, Modal } from 'react-bootstrap';
import { eventRespository } from '../services/event.service';
import Swal from 'sweetalert2';
import { PencilIcon, PlusIcon, TrashIcon } from './icons/icons-shared';
import { logAsyncError } from './error-boundary/logError';

const TypeEvents = () => {
  const [typeEvent, setTypeEvent] = useState([]);
  const [form, setForm] = useState({
    idtipoevento: 0,
    nombre: '',
    desactivataller: 0,
  });
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  useEffect(() => {
    let activo = true;
    getEventAll(() => activo);
    return () => {
      activo = false;
    };
  }, []);

  const handleChange = (e) => {
    if (e.target.id === 'desactivataller') {
      setForm({
        ...form,
        [e.target.name]: e.target.checked,
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const showModalInsert = () => {
    setModalInsert(true);
  };

  const handleModalInsert = () => {
    setModalInsert(false);
  };

  const showModalEdit = (data) => {
    setModalEdit(true);
    setForm({
      idtipoevento: data.idtipoevento,
      nombre: data.nombre,
      desactivataller: data.desactivataller,
    });
  };

  const handleModalEdit = () => {
    setModalEdit(false);
  };

  // Función que obtiene para eliminar un tipos de evento
  const deleteTypeEvent = async (data) => {
    try {
      let modifidedEvent = {
        borrado: 1,
      };
      await eventRespository.updateTypeEvent(data.idtipoevento, modifidedEvent);
    } catch (error) {
      logAsyncError(error, { context: 'eliminar tipo de evento' });
    }
  };

  const handleDelete = (data) => {
    Swal.fire({
      title: `¿Seguro que desea eliminar el tipo de evento ${data.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar el tipo de evento',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado con exito!', `Se elimino el evento ${data.nombre}`, 'success');
        setTypeEvent((prev) => prev.filter((item) => item.idtipoevento !== data.idtipoevento));
        deleteTypeEvent(data);
      }
    });
  };

  const edit = (data) => {
    let list = [...typeEvent];
    let modifidedEvent;
    list.map((listdata) => {
      if (data.idtipoevento === listdata.idtipoevento) {
        modifidedEvent = {
          id: data.idtipoevento,
          nombre: data.nombre,
          desactivataller: data.desactivataller === true ? 1 : 0,
          borrado: 0,
        };
        return modifidedEvent;
      }
      return list;
    });

    eventRespository.updateTypeEvent(data.idtipoevento, modifidedEvent).then((response) => {
      if (response?.success) {
        notificacionExito();
        clear();
        getEventAll();
      }
    });
    setTypeEvent(list);
    setModalEdit(false);
  };

  const guardarNuevo = () => {
    let data = {};
    data = {
      nombre: form.nombre,
      desactivataller: form.desactivataller === true ? 1 : 0,
      borrado: 0,
    };
    eventRespository.createTypeEvent(data).then((response) => {
      if (response?.success) {
        setModalInsert(false);
        notificacionExito();
        clear();
        getEventAll();
      }
    });
  };
  // Función que obtiene la lista de tipos de eventos
  const getEventAll = async (isActivo = () => true) => {
    try {
      let response = await eventRespository.getEventAll();
      if (!isActivo()) return;
      if (response?.success && response?.data) {
        setTypeEvent(response.data);
      }
    } catch (error) {
      logAsyncError(error, { context: 'obtener tipos de evento' });
    }
  };

  const clear = () => {
    setForm({ idtipoevento: 0, nombre: '', desactivataller: 0 });
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
                .filter((element) => element.borrado === 0)
                .map((element) => (
                  <tr key={element.idtipoevento}>
                    <td>{element.idtipoevento}</td>
                    <td>{element.nombre}</td>
                    <td>
                      <input
                        disabled={true}
                        type="checkbox"
                        checked={element.desactivataller === 1 ? true : false}
                        className="form-check-input"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-verde me-1"
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

      <Modal show={modalInsert}>
        <Modal.Header>
          <div>
            <h2>Nuevo tipo de evento</h2>
          </div>
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
              onChange={handleChange}
            />
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
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-rojo"
            data-bs-dismiss="modal"
            onClick={() => handleModalInsert()}
          >
            Cancelar
          </button>
          <button type="button" className="btn btn-verde" onClick={() => guardarNuevo()}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      {/* EDITAR */}

      <Modal show={modalEdit}>
        <Modal.Header>
          <div>
            <h2>Editar tipo de evento</h2>
          </div>
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
                onChange={handleChange}
                value={form.idtipoevento}
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
                onChange={handleChange}
                value={form.nombre}
              />
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
                onChange={handleChange}
                defaultChecked={form.desactivataller === 1 ? true : false}
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
          <button type="button" className="btn btn-verde" onClick={() => edit(form)}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default TypeEvents;
