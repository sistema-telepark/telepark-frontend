import React, { memo, useState, useEffect, useRef } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from './icons/icons-shared';
import { useForm } from 'react-hook-form';
import { pacienteRepository } from '../services/paciente.service';
import Vivienda from './add-paciente/vivienda.component';
import DatosPersonales from './add-paciente/datos-personales.component';
import CondicionesVivienda from './add-paciente/condiciones-vivienda.component';
import styles from '../styles/add-paciente.module.css';
import utils from '../utils/utils';
import { eventRespository } from '../services/event.service';
import { provinciaRepository } from '../services/provincia.service';
import Swal from 'sweetalert2';
import { Form, Modal } from 'react-bootstrap';

const AdminPersonas = () => {
  const [arrayProvincias, setArrayProvincias] = useState([]);
  const [arrayPerson, setArrayPerson] = useState([]);
  const [buscar, setBuscar] = useState('');
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
  const mostrarNotificacionAlCerrar = useRef(false);

  useEffect(() => {
    getPersonAll();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const cargarProvincias = async () => {
      const response = await provinciaRepository.getAll();
      if (response && response.data) {
        setArrayProvincias(
          response.data.map((provincia) => ({
            idprovincia: provincia.idprovincia,
            provincia: provincia.nombre,
          }))
        );
      }
    };

    cargarProvincias();
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
      .catch(() => {
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

  // Función que obtiene la lista de TODAS las personas
  // B01 (HITL 2026-08-11): el backend responde envelope DRF paginado
  // {count,next,previous,results} → normalizar a .results (patrón RA-13,
  // consistente con los componentes del módulo Taller).
  const getPersonAll = async () => {
    let response = await eventRespository.getAll();
    if (response?.success) {
      setArrayPerson(response.data.results ?? response.data);
    }
  };

  const handleModalInsert = () => {
    setModalInsert(false);
  };

  const handleModalInsertClosed = () => {
    if (mostrarNotificacionAlCerrar.current) {
      mostrarNotificacionAlCerrar.current = false;
      document.activeElement?.blur();
      setTimeout(() => utils.send(), 0);
    }
  };

  const showModalInsert = () => {
    setModalInsert(true);
  };

  const enviarFormulario = async (data) => {
    const response = await pacienteRepository.guardarPaciente(data).catch(() => utils.errorSend());
    if (response) {
      reset();
      mostrarNotificacionAlCerrar.current = true;
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
          .catch(() => {
            notificacionError();
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
        <h2 className="mt-4 text-center">Personas con EP</h2>
        <hr />
        <button
          type="button"
          className="btn btn-azul mb-2 mt-2"
          onClick={() => showModalInsert()}
        >
          <PlusIcon />
          Agregar
        </button>
        <form
          className="row align-items-center mt-2"
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
      </main>

      {/* EDITAR */}
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

      {/* AGREGAR PERSONA CON EP */}
      <Modal show={modalInsert} onExit={handleModalInsertClosed} restoreFocus={false}>
        <Modal.Header className="justify-content-center">
          <h2 className="mb-0">Agregar persona con EP</h2>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(customSubmit)}>
            <DatosPersonales register={register} errors={errors} tipo="EP" />
            <br />
            <CondicionesVivienda register={register} />
            <Vivienda
              register={register}
              errors={errors}
              watch={watch}
              tipo="EP"
              setValue={setValue}
              arrayProvincias={arrayProvincias}
            />
            <br />
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
            <div className={'row ' + styles.referenteSection}>
              <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                <h2 className="text-center">Referente</h2>
              </div>
            </div>
            <br />
            <DatosPersonales register={register} errors={errors} tipo="R" />
            <br />
            <Vivienda
              register={register}
              errors={errors}
              watch={watch}
              tipo="R"
              setValue={setValue}
              arrayProvincias={arrayProvincias}
            />
          </Form>
        </Modal.Body>
        <br />
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-rojo" onClick={() => handleModalInsert()}>
            Cancelar
          </button>
          <button type="button" className="btn btn-verde" onClick={handleSubmit(customSubmit)}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default memo(AdminPersonas);
