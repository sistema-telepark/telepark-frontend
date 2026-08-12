import React, { memo, useState, useEffect } from 'react';
import { PencilIcon, PlusIcon } from './icons/icons-shared';
import { useForm } from 'react-hook-form';
import { pacienteRepository } from '../services/paciente.service';
import { municipioRepository } from '../services/municipio.service';
import Vivienda from './add-paciente/vivienda.component';
import DatosPersonales from './add-paciente/datos-personales.component';
import utils from '../utils/utils';
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
  const [modalInsert, setModalInsert] = useState(false);

  useEffect(() => {
    getPersonAll();
  }, []);

  const [municipios, setMunicipios] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    getMunicipios();
  }, []);

  // Función que obtiene la lista de municipios (patrón add-paciente L25-30)
  const getMunicipios = async () => {
    const response = await municipioRepository.getAll().catch(() => undefined);
    if (response) {
      setMunicipios(response.data);
    }
  };

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
  // B01 (HITL 2026-08-11): el backend responde envelope DRF paginado
  // {count,next,previous,results} → normalizar a .results (patrón RA-13,
  // consistente con los componentes del módulo Taller).
  const getPersonAll = async () => {
    let response = await eventRespository.getAll();
    if (response && response.data) {
      setArrayPerson(response.data.results ?? response.data);
    }
  };

  const handleModalInsert = () => {
    setModalInsert(false);
  };

  const showModalInsert = () => {
    setModalInsert(true);
  };

  const enviarFormulario = async (data) => {
    const response = await pacienteRepository.guardarPaciente(data).catch(() => utils.errorSend());
    if (response) {
      utils.send();
      reset();
      handleModalInsert();
      getPersonAll();
    }
  };

  const customSubmit = (data) => {
    enviarFormulario(data);
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
        <button
          type="button"
          className="btn btn-primary mb-2 mt-2"
          onClick={() => showModalInsert()}
        >
          <PlusIcon className="signoMas" />
          Agregar
        </button>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Telefono</th>
                <th scope="col">Accion</th>
              </tr>
            </thead>
            {arrayPersonIspaciente.map((person, index) => (
              <tbody key={person.idpersona}>
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

      {/* AGREGAR PERSONA CON EP */}
      <Modal isOpen={modalInsert}>
        <ModalHeader>
          <div>
            <h2>Agregar persona con EP</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(customSubmit)}>
            <DatosPersonales register={register} errors={errors} tipo="EP" />
            <Vivienda
              register={register}
              errors={errors}
              watch={watch}
              tipo="EP"
              arrayProvincias={utils.retornarProvincias()}
              municipios={municipios}
            />
            <div className="row mt-4">
              <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                <h3>Otros Datos</h3>
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
                <label className="col-form-label">Maxima Escolaridad</label>
                <select
                  type="text"
                  className="form-select"
                  {...register('escolaridadEP', {
                    required: {
                      value: true,
                      message: 'Debe seleccionar una opción',
                    },
                  })}
                >
                  <option value="">Escolaridad </option>
                  <option value="Sin Escolaridad">Sin Escolaridad</option>
                  <option value="Primario">Primario</option>
                  <option value="Secundario">Secundario</option>
                  <option value="Terciario">Terciario</option>
                  <option value="Universitario">Universitario</option>
                </select>
                {errors['escolaridadEP'] && (
                  <small className="field-error">{errors['escolaridadEP'].message}</small>
                )}
              </div>
              <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
                <label className="col-form-label">Nivel Completado</label>
                <select
                  type="text"
                  className="form-select"
                  {...register('nivelCompletoEP', {
                    required: {
                      value: true,
                      message: 'Debe seleccionar una opción',
                    },
                  })}
                >
                  <option value="">Elegir</option>
                  <option value="1">Si</option>
                  <option value="0">No</option>
                </select>
                {errors['nivelCompletoEP'] && (
                  <small className="field-error">{errors['nivelCompletoEP'].message}</small>
                )}
              </div>
              <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
                <label className="col-form-label">Ocupacion Previa</label>
                <select
                  type="text"
                  className="form-select"
                  {...register('ocupacionPEP', {
                    required: {
                      value: true,
                      message: 'Debe seleccionar una opción',
                    },
                  })}
                >
                  <option value="">Profesion</option>
                  <option value="Desocupado">Desocupado</option>
                  <option value="Ocupado">Ocupado</option>
                  <option value="Subocupado">Subocupado</option>
                </select>
                {errors['ocupacionPEP'] && (
                  <small className="field-error">{errors['ocupacionPEP'].message}</small>
                )}
              </div>
              <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
                <label className="col-form-label">Ocupacion Actual</label>
                <select
                  type="text"
                  className="form-select"
                  {...register('ocupacionAEP', {
                    required: {
                      value: true,
                      message: 'Debe seleccionar una opción',
                    },
                  })}
                >
                  <option value="">Profesion</option>
                  <option value="Desocupado">Desocupado</option>
                  <option value="Ocupado">Ocupado</option>
                  <option value="Subocupado">Subocupado</option>
                </select>
                {errors['ocupacionAEP'] && (
                  <small className="field-error">{errors['ocupacionAEP'].message}</small>
                )}
              </div>
            </div>
            <DatosPersonales register={register} errors={errors} tipo="R" />
            <Vivienda
              register={register}
              errors={errors}
              watch={watch}
              tipo="R"
              arrayProvincias={utils.retornarProvincias()}
              municipios={municipios}
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-rojo" onClick={() => handleModalInsert()}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit(customSubmit)}>
            Agregar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default memo(Search);
