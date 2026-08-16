import React, { useState, useEffect } from 'react';
import { Container, Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { eventRespository } from '../services/event.service';
import Swal from 'sweetalert2';
import { PencilIcon, PlusIcon } from './icons/icons-shared';

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
    getEventAll();
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
    let modifidedEvent = {
      borrado: 1,
    };
    await eventRespository.updateTypeEvent(data.idtipoevento, modifidedEvent);
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
        let cont = 0;
        let list = typeEvent;
        list.map((listdata) => {
          if (data.idtipoevento === listdata.idtipoevento) {
            list.splice(cont, 1);
          }
          return cont++;
        });
        deleteTypeEvent(data);
        setTypeEvent(list);
      }
    });
  };

  const edit = (data) => {
    let list = typeEvent;
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

    eventRespository
      .updateTypeEvent(data.idtipoevento, modifidedEvent)
      .then((response) => {
        if (response) {
          notificacionExito();
          clear();
          getEventAll();
        }
      })
      .catch(() => {
        notificacionError();
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
    eventRespository
      .createTypeEvent(data)
      .then((response) => {
        if (response) {
          setModalInsert(false);
          notificacionExito();
          clear();
          getEventAll();
        }
      })
      .catch(() => {
        notificacionError();
      });
  };
  // Función que obtiene la lista de tipos de eventos
  const getEventAll = async () => {
    let response = await eventRespository.getEventAll();
    if (response) {
      setTypeEvent(response.data);
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

  return (
    <>
      <Container>
        <h1 className="mt-4 mt-md-2 text-center">Tipos de eventos</h1>
        <button className="btn btn-primary mb-2 mt-2" onClick={() => showModalInsert()}>
          <PlusIcon className="signoMas" /> Agregar
        </button>
        <div className="row m-md-3 shadow mx-md-auto border-top-sm m-0">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Desactivar Taller</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            {typeEvent
              .filter((element) => element.borrado === 0)
              .map((element) => (
                <tbody key={element.idtipoevento}>
                  <tr>
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
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
      </Container>

      <Modal isOpen={modalInsert}>
        <ModalHeader>
          <div>
            <h2>Ingresar nuevo tipo de evento</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label htmlFor="nombre" className="control-label">
              Nombre de tipo de evento:
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              className="form-control"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-rojo"
            data-bs-dismiss="modal"
            onClick={() => handleModalInsert()}
          >
            Cancelar
          </button>
          <button type="button" className="btn btn-azul" onClick={() => guardarNuevo()}>
            <PlusIcon />
            Agregar
          </button>
        </ModalFooter>
      </Modal>

      {/* EDITAR */}

      <Modal isOpen={modalEdit}>
        <ModalHeader>
          <div>
            <h2>Editar tipo de evento</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
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
            </FormGroup>
            <FormGroup>
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
            </FormGroup>
            <FormGroup>
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
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={() => handleModalEdit()}
          >
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={() => edit(form)}>
            Guardar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default TypeEvents;
