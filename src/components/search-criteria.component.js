import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { eventRespository } from '../services/event.service';
import Swal from 'sweetalert2';
import { Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const Search = () => {
  const [arrayPerson, setArrayPerson] = useState([]);
  const [searchArrayperson, setSearchArrayperson] = useState({
    idpersona: 0,
    nombre: '',
    apellido: '',
    telefono: 0,
    borrado: 0,
    espaciente: 0,
  });
  const [modalEdit, setModalEdit] = useState(false);

  useEffect(() => {
    getPersonAll();
  }, []);

  const handleChange = (e) => {
    setSearchArrayperson({
      ...searchArrayperson,
      [e.target.name]: e.target.value,
    });
  };

  const edit = (data) => {
    let list = arrayPerson;
    let modifidedPerson;
    list.map((listdata) => {
      if (data.idpersona === listdata.idpersona) {
        modifidedPerson = {
          id: data.idpersona,
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          borrado: listdata.borrado,
          espaciente: listdata.espaciente,
        };
        return modifidedPerson;
      }
      return list;
    });
    eventRespository
      .updatePerson(data.idpersona, modifidedPerson)
      .then((response) => {
        if (response) {
          notificacionExito();
          clear();
          getPersonAll();
        }
      })
      .catch((error) => {
        notificacionError();
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
      espaciente: 0,
      borrado: 0,
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

  // Función que obtiene la lista de personas con ep
  const getPersonAll = async () => {
    let response = await eventRespository.getAll();
    if (response) {
      setArrayPerson(response.data);
    }
  };

  const eliminar = (persona) => {
    let arrayPersonas = arrayPerson.filter(function (e) {
      return e.idpersona !== persona.idpersona;
    });
    // modifico el borrado logico de la persona
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
        eventRespository
          .updatePerson(persona.idpersona, persona)
          .then((response) => {
            if (response) {
              notificacionExito();
              getPersonAll();
            }
          })
          .catch((error) => {
            notificacionError();
          });
        setArrayPerson(arrayPersonas);
        setSearchArrayperson(arrayPerson);
      }
    });
  };

  const buscar = () => {
    let nombre = searchArrayperson.nombre;
    let arrayPersonas = arrayPerson.filter(function (person) {
      return person.nombre.includes(nombre);
    });
    setSearchArrayperson({
      idpersona: arrayPersonas.idpersona,
      nombre: arrayPersonas.nombre,
      apellido: arrayPersonas.apellido,
      telefono: arrayPersonas.telefono,
      espaciente: arrayPersonas.espaciente,
    });
    console.log(searchArrayperson);
  };

  const buscarName = (e) => {
    setSearchArrayperson({
      nombre: e.target.value,
    });
  };

  const buscarLastName = (e) => {
    setSearchArrayperson({
      ...searchArrayperson,
      [e.target.name]: e.target.value,
    });
  };

  let arrayPersonIspaciente = arrayPerson.filter(
    (e) => e.espaciente === 1 && e.borrado !== 1
  );

  return (
    <>
      <main className="border-top-sm m-0 justify-content-center m-md-3 rounded shadow container-lg mx-md-auto">
        <h1 className="mt-4 mt-md-2 text-center">Personas con EP</h1>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Telefono</th>
                <th scope="col">Accion</th>
              </tr>
            </thead>
            {arrayPersonIspaciente.map((person, index) => (
              <tbody key={index}>
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
                      className="btn btn-danger"
                      onClick={() => eliminar(person)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </main>

      {/* EDITAR */}
      <Modal isOpen={modalEdit}>
        <ModalHeader>
          <div>
            <h2>Editar la persona con ep</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
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
            </FormGroup>
            <FormGroup>
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
            </FormGroup>
            <FormGroup>
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
            </FormGroup>
            <FormGroup>
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => edit(searchArrayperson)}
          >
            Guardar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default Search;
