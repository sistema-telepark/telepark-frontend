import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { cambiarID } from '../actions/global';
import { pacienteRepository } from '../services/paciente.service';
import '../styles/list-pacientes-ep.css';
import { Spinner, Form, Modal } from 'react-bootstrap';
import utils from '../utils/utils';
import {
  EyeIcon,
  ClipboardCheckIcon,
  ClipboardDataIcon,
  JournalPlusIcon,
  JournalTextIcon,
  PlusIcon,
} from './icons/icons-shared';
import styles from '../styles/list-pacientes-ep.module.css';
import addPacienteStyles from '../styles/add-paciente.module.css';
import { useForm } from 'react-hook-form';
import { provinciaRepository } from '../services/provincia.service';
import Vivienda from './add-paciente/vivienda.component';
import DatosPersonales from './add-paciente/datos-personales.component';
import CondicionesVivienda from './add-paciente/condiciones-vivienda.component';
import PropTypes from 'prop-types';

const ListaPaciente = (props) => {
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [arrayProvincias, setArrayProvincias] = useState([]);
  const mostrarNotificacionAlCerrar = useRef(false);

  useEffect(() => {
    getPacientes();
  }, []);

  // Obtiene únicamente las personas que tienen ficha de EP.
  const getPacientes = async () => {
    const response = await pacienteRepository
      .getPacientesEp()
      .catch(() => utils.notificacionError());
    if (response?.success) {
      setPacientes(response.data.results ?? response.data);
      setLoading(false);
    }
  };

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
      getPacientes();
    }
  };

  const customSubmit = (data) => {
    enviarFormulario(data);
  };

  // Funcion que guarda el valor del buscador
  const detectarCambio = (e) => {
    setBuscar(e.target.value);
  };

  // Funcion que navega a las diferentes secciones
  const verSeccion = (id, nombre, apellido) => {
    const idpersona = id;
    const nombrepersona = nombre + ' ' + apellido;
    props.cambiarID(idpersona, nombrepersona);
  };

  return (
    <>
      <main className="container panel-gris">
        <div className="row">
          <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12">
            <h2 className="mt-4 text-center">Personas con Enfermedad de Parkinson</h2>
            <hr />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12 col-md-12 col-lg-12 col-xl-12">
            <button
              type="button"
              className="btn btn-azul mb-2 mt-2"
              onClick={() => showModalInsert()}
            >
              <PlusIcon />
              Agregar
            </button>
            <input
              type="search"
              className="form-control"
              placeholder="Buscar"
              id="buscador"
              aria-describedby="buscador"
              onChange={detectarCambio}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 col-xl-12 text-center">
            {loading ? (
              <Spinner className={styles.spinner} animation="border" variant="primary">
                Loading...
              </Spinner>
            ) : (
              <table className="table table-bordered table-hover shadow table-striped">
                <thead>
                  <tr>
                    <th scope="col">Nombre completo</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBodyMiddle}>
                  {pacientes &&
                    pacientes
                      .filter(
                        (paciente) =>
                          paciente.nombre.toLowerCase().includes(buscar) ||
                          paciente.apellido.toLowerCase().includes(buscar) ||
                          paciente.nombre.toUpperCase().includes(buscar) ||
                          paciente.apellido.toUpperCase().includes(buscar)
                      )
                      .map((paciente) => (
                        <tr key={paciente.idpersona ?? paciente.id}>
                          <td>
                            {paciente.nombre} {paciente.apellido}
                          </td>
                          <td>
                            <Link
                              to="/ficha"
                              onClick={() =>
                                verSeccion(paciente.idpersona, paciente.nombre, paciente.apellido)
                              }
                            >
                              <button
                                type="button"
                                title="Ver Ficha Médica"
                                className={'btn ' + styles.actionButtonVerde}
                              >
                                <EyeIcon />
                              </button>
                            </Link>

                            <Link
                              to="/list-diagnostico"
                              onClick={() =>
                                verSeccion(paciente.idpersona, paciente.nombre, paciente.apellido)
                              }
                            >
                              <button
                                type="button"
                                title="Ver Diagnósticos"
                                className={'btn ' + styles.actionButtonNaranja}
                              >
                                <ClipboardCheckIcon />
                              </button>
                            </Link>

                            <Link
                              to="/list-evolucion"
                              onClick={() =>
                                verSeccion(paciente.idpersona, paciente.nombre, paciente.apellido)
                              }
                            >
                              <button
                                type="button"
                                title="Ver Evolución"
                                className={'btn ' + styles.actionButtonRojo}
                              >
                                <ClipboardDataIcon />
                              </button>
                            </Link>

                            <Link
                              to="/list-obrasocial"
                              onClick={() =>
                                verSeccion(paciente.idpersona, paciente.nombre, paciente.apellido)
                              }
                            >
                              <button
                                type="button"
                                title="Ver Obra Social"
                                className={'btn ' + styles.actionButtonVioleta}
                              >
                                <JournalPlusIcon />
                              </button>
                            </Link>

                            <Link
                              to="/list-indicacion"
                              onClick={() =>
                                verSeccion(paciente.idpersona, paciente.nombre, paciente.apellido)
                              }
                            >
                              <button
                                type="button"
                                title="Ver Indicaciones Médicas"
                                className={'btn ' + styles.actionButtonAzul}
                              >
                                <JournalTextIcon />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

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
            <div className={'row ' + addPacienteStyles.referenteSection}>
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

ListaPaciente.propTypes = {
  cambiarID: PropTypes.func.isRequired,
  idEpElegido: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nombreEpElegido: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    idEpElegido: state.global.idEpElegido,
    nombreEpElegido: state.global.nombreEpElegido,
  };
};

export default connect(mapStateToProps, { cambiarID })(ListaPaciente);
