import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { connect } from 'react-redux';
import { cambiarID } from '../actions/global';
import { pacienteRepository } from '../services/pacienteService';
import '../styles/list-pacientesEp.css';
import { Spinner } from 'reactstrap';
import utils from '../utils/utils';
import { SearchIcon, EyeIcon, ClipboardCheckIcon, ClipboardDataIcon, JournalPlusIcon, JournalTextIcon } from './icons/IconsShared';

const ListaPaciente = (props) => {
  const [loading, setLoading] = useState(true);
  const [buscador, setBuscador] = useState('');
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    getPacientes();
  }, []);

  // Funcion que obtiene la lista de pacientes
  const getPacientes = async () => {
    const response = await pacienteRepository.getPacientes().catch(() => utils.notificacionError());
    if (response) {
      setPacientes(response.data);
      setLoading(false);
    }
  };

  // Funcion que guarda el valor del buscador
  const detectarCambio = (e) => {
    setBuscador(e.target.value);
  };

  // Funcion que navega a las diferentes secciones
  const verSeccion = (id, nombre, apellido) => {
    const idpersona = id;
    const nombrepersona = nombre + ' ' + apellido;
    props.cambiarID(idpersona, nombrepersona);
  };

  return (
    <main className="container form-paciente">
      <div className="row">
        <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12">
          <h3>Personas con Enfermedad de Parkinson</h3>
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="col-10 col-md-10 col-lg-6 col-xl-6">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar"
            id="buscador"
            aria-describedby="buscador"
            onChange={detectarCambio}
          />
        </div>
        <div className="mb-4 col-2 col-md-2 col-lg-6 col-xl-6" style={{ paddingLeft: '0px' }}>
          <button type="button" className="btn btn-verde">
            <SearchIcon />
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12 text-center">
          {loading ? (
            <Spinner
              color="primary"
              style={{
                height: '4rem',
                width: '4rem',
              }}
            >
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
              <tbody style={{ verticalAlign: 'middle' }}>
                {pacientes &&
                  pacientes
                    .filter(
                      (paciente) =>
                        paciente.idpersona.nombre.toLowerCase().includes(buscador) ||
                        paciente.idpersona.apellido.toLowerCase().includes(buscador) ||
                        paciente.idpersona.nombre.toUpperCase().includes(buscador) ||
                        paciente.idpersona.apellido.toUpperCase().includes(buscador)
                    )
                    .map((paciente, index) => (
                      <tr key={paciente.idpersona?.idpersona ?? paciente.id}>
                        <td>
                          {paciente.idpersona.nombre} {paciente.idpersona.apellido}
                        </td>
                        <td>
                          <Link
                            to="/ficha"
                            onClick={() =>
                              verSeccion(
                                paciente.idpersona.idpersona,
                                paciente.idpersona.nombre,
                                paciente.idpersona.apellido
                              )
                            }
                          >
                            <button
                              type="button"
                              className="btn"
                              title="Ver Ficha Médica"
                              style={{
                                marginRight: 10,
                                boxShadow: '3px 3px #13E000',
                                backgroundImage:
                                  'linear-gradient(to right, #9bff92, #8efe86, #80fd79, #71fc6c, #5ffb5e, #58fb54, #51fb4a, #4afb3e, #51fc35, #57fd2a, #5efe1c, #64ff00)',
                              }}
                            >
                              <EyeIcon />
                            </button>
                          </Link>

                          <Link
                            to="/list-diagnostico"
                            onClick={() =>
                              verSeccion(
                                paciente.idpersona.idpersona,
                                paciente.idpersona.nombre,
                                paciente.idpersona.apellido
                              )
                            }
                          >
                            <button
                              type="button"
                              className="btn"
                              title="Ver Diagnósticos"
                              style={{
                                marginRight: 10,
                                boxShadow: '3px 3px #FF9B00',
                                backgroundImage:
                                  'linear-gradient(to right, #ffcf46, #ffcb3f, #ffc738, #ffc330, #ffbf28, #ffbc23, #ffb81d, #ffb516, #ffb111, #ffae0b, #ffaa05, #ffa600)',
                              }}
                            >
                              <ClipboardCheckIcon />
                            </button>
                          </Link>

                          <Link
                            to="/list-evolucion"
                            onClick={() =>
                              verSeccion(
                                paciente.idpersona.idpersona,
                                paciente.idpersona.nombre,
                                paciente.idpersona.apellido
                              )
                            }
                          >
                            <button
                              type="button"
                              className="btn"
                              title="Ver Evolución"
                              style={{
                                marginRight: 10,
                                boxShadow: '3px 3px #D80000',
                                backgroundImage:
                                  'linear-gradient(to right, #ff7171, #ff6867, #ff5e5d, #ff5453, #ff4948, #ff4140, #ff3938, #ff302f, #ff2826, #ff1f1d, #ff1311, #ff0000)',
                              }}
                            >
                              <ClipboardDataIcon />
                            </button>
                          </Link>

                          <Link
                            to="/list-obrasocial"
                            onClick={() =>
                              verSeccion(
                                paciente.idpersona.idpersona,
                                paciente.idpersona.nombre,
                                paciente.idpersona.apellido
                              )
                            }
                          >
                            <button
                              type="button"
                              className="btn"
                              title="Ver Obra Social"
                              style={{
                                marginRight: 10,
                                boxShadow: '3px 3px #9700CD',
                                backgroundImage:
                                  'linear-gradient(to right, #e290ff, #e087ff, #dd7eff, #db74ff, #d86aff, #d561ff, #d258ff, #cf4eff, #cb42ff, #c634ff, #c122ff, #bc00ff)',
                              }}
                            >
                              <JournalPlusIcon />
                            </button>
                          </Link>

                          <Link
                            to="/list-indicacion"
                            onClick={() =>
                              verSeccion(
                                paciente.idpersona.idpersona,
                                paciente.idpersona.nombre,
                                paciente.idpersona.apellido
                              )
                            }
                          >
                            <button
                              type="button"
                              className="btn"
                              title="Ver Indicaciones Médicas"
                              style={{
                                marginRight: 10,
                                boxShadow: '3px 3px #0059CD',
                                backgroundImage:
                                  'linear-gradient(to right, #6ba7f6, #62a2f7, #599df8, #4f98f9, #4593fa, #3c8efb, #338afc, #2a85fd, #2080fe, #157afe, #0a75ff, #006fff)',
                              }}
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

const mapStateToProps = (state) => {
  return {
    idEpElegido: state.global.idEpElegido,
    nombreEpElegido: state.global.nombreEpElegido,
  };
};

export default connect(mapStateToProps, { cambiarID })(ListaPaciente);
