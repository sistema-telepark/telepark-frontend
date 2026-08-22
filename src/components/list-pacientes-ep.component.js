import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { cambiarID } from '../actions/global';
import { pacienteRepository } from '../services/paciente.service';
import '../styles/list-pacientes-ep.css';
import { Spinner } from 'reactstrap';
import utils from '../utils/utils';
import {
  EyeIcon,
  ClipboardCheckIcon,
  ClipboardDataIcon,
  JournalPlusIcon,
  JournalTextIcon,
} from './icons/icons-shared';
import styles from '../styles/list-pacientes-ep.module.css';
import PropTypes from 'prop-types';

const ListaPaciente = (props) => {
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState('');
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    getPacientes();
  }, []);

  // Funcion que obtiene la lista de pacientes
  // B01 (HITL 2026-08-11): /personas?espaciente=1 devuelve envelope DRF paginado
  // {count,next,previous,results} → normalizar a .results (patrón RA-13).
  const getPacientes = async () => {
    const response = await pacienteRepository.getPacientes().catch(() => utils.notificacionError());
    if (response && response.data) {
      setPacientes(response.data.results ?? response.data);
      setLoading(false);
    }
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
    <main className="container panel-gris">
      <div className="row">
        <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12">
          <h2 className="mt-4 text-center">Personas con Enfermedad de Parkinson</h2>
          <hr />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
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
            <Spinner className={styles.spinner} color="primary">
              Loading...
            </Spinner>
          ) : (
            <table className="table table-bordered table-hover shadow table-striped">
              <thead>
                <tr>
                  <th scope="col">Paciente</th>
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
                              verSeccion(
                                paciente.idpersona,
                                paciente.nombre,
                                paciente.apellido
                              )
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
                              verSeccion(
                                paciente.idpersona,
                                paciente.nombre,
                                paciente.apellido
                              )
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
                              verSeccion(
                                paciente.idpersona,
                                paciente.nombre,
                                paciente.apellido
                              )
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
                              verSeccion(
                                paciente.idpersona,
                                paciente.nombre,
                                paciente.apellido
                              )
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
                              verSeccion(
                                paciente.idpersona,
                                paciente.nombre,
                                paciente.apellido
                              )
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
