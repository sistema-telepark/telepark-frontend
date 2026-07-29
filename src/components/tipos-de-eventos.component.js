import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { eventRespository } from '../services/event.service';
import Swal from 'sweetalert2';

class TypeEvents extends React.Component {
  state = {
    typeEvent: [],
    form: {
      idtipoevento: 0,
      nombre: '',
      desactivataller: 0,
    },
    modalInsert: false,
    modalEdit: false,
  };

  componentDidMount() {
    this.getEventAll();
  }

  handleChange = (e) => {
    if (e.target.id === 'desactivataller') {
      this.setState({
        form: {
          ...this.state.form,
          [e.target.name]: e.target.checked,
        },
      });
    } else {
      this.setState({
        form: {
          ...this.state.form,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  showModalInsert = () => {
    this.setState({ modalInsert: true });
  };

  handleModalInsert = () => {
    this.setState({ modalInsert: false });
  };

  showModalEdit = (data) => {
    this.setState({
      modalEdit: true,
      form: {
        idtipoevento: data.idtipoevento,
        nombre: data.nombre,
        desactivataller: data.desactivataller,
      },
      error: '',
    });
  };

  handleModalEdit = () => {
    this.setState({ modalEdit: false });
  };

  // Función que obtiene para eliminar un tipos de evento
  deleteTypeEvent = async (data) => {
    let modifidedEvent = {
      borrado: 1,
    };
    await eventRespository.updateTypeEvent(data.idtipoevento, modifidedEvent);
  };

  delete = (data) => {
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
        let list = this.state.typeEvent;
        list.map((listdata) => {
          if (data.idtipoevento === listdata.idtipoevento) {
            list.splice(cont, 1);
          }
          return cont++;
        });
        this.deleteTypeEvent(data);
        this.setState({ typeEvent: list });
      }
    });
  };

  edit = (data) => {
    let list = this.state.typeEvent;
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
          this.notificacionExito();
          this.clear();
          this.getEventAll();
        }
      })
      .catch((error) => {
        this.notificacionError();
      });
    this.setState({ list, modalEdit: false, error: '' });
  };

  guardarNuevo() {
    let data = {};
    data = {
      nombre: this.state.form.nombre,
      desactivataller: this.state.form.desactivataller === true ? 1 : 0,
      borrado: 0,
    };
    eventRespository
      .createTypeEvent(data)
      .then((response) => {
        if (response) {
          this.setState({ modalInsert: false });
          this.notificacionExito();
          this.clear();
          this.getEventAll();
        }
      })
      .catch((error) => {
        this.notificacionError();
      });
  }
  // Función que obtiene la lista de tipos de eventos
  getEventAll = async () => {
    let response = await eventRespository.getEventAll();
    if (response) {
      this.setState({ typeEvent: response.data });
    }
  };

  clear() {
    this.setState({ form: { idtipoevento: 0, nombre: '', desactivataller: 0 } });
  }

  addNewEvent() {
    this.clear();
  }

  //notificaciones
  notificacionExito() {
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
  }

  //notificaciones
  notificacionError() {
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
  }

  render() {
    console.log(this.state.typeEvent);
    return (
      <>
        <Container>
          <h1 className="mt-4 mt-md-2 text-center">Tipos de eventos</h1>
          <button className="btn btn-primary mb-2 mt-2" onClick={() => this.showModalInsert()}>
            Insertar nuevo tipo de evento
          </button>
          <div className="row m-md-3 shadow mx-md-auto border-top-sm m-0">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Desactivar Taller</th>
                  <th scope="col">Accion</th>
                </tr>
              </thead>
              {this.state.typeEvent
                .filter((element) => element.borrado === 0)
                .map((element, index) => (
                  <tbody key={index}>
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
                          onClick={() => this.showModalEdit(element)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="btn btn-rojo"
                          onClick={() => this.delete(element)}
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

        <Modal isOpen={this.state.modalInsert}>
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
                onChange={this.handleChange}
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
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-rojo"
              data-bs-dismiss="modal"
              onClick={() => this.handleModalInsert()}
            >
              Cancelar
            </button>
            <button type="button" className="btn btn-azul" onClick={() => this.guardarNuevo()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-lg"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
              </svg>
              Agregar
            </button>
          </ModalFooter>
        </Modal>

        {/* EDITAR */}

        <Modal isOpen={this.state.modalEdit}>
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
                  onChange={this.handleChange}
                  value={this.state.form.idtipoevento}
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
                  onChange={this.handleChange}
                  value={this.state.form.nombre}
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
                  onChange={this.handleChange}
                  defaultChecked={this.state.form.desactivataller === 1 ? true : false}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => this.handleModalEdit()}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => this.edit(this.state.form)}
            >
              Guardar
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default TypeEvents;
