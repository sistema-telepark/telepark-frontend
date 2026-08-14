import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { diagnosticoRepository } from '../services/diagnostico.service';
import { evolucionRepository } from '../services/evolucion.service';
import { osRepository } from '../services/os.service';
import { indicacionRepository } from '../services/indicacion.service';
import utils from '../utils/utils';
import styles from '../styles/ficha-medica.module.css';

const FichaMedica = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);
  const dispatch = useDispatch();

  const [diagnosticos, setDiagnosticos] = useState();
  const [evoluciones, setEvoluciones] = useState();
  const [osociales, setOsociales] = useState();
  const [indicaciones, setIndicaciones] = useState();

  useEffect(() => {
    getDiagnosticos();
    getEvoluciones();
    getOs();
    getIndicaciones();
  }, []);

  // Funcion que obtiene la lista de diagnosticos de un paciente
  const getDiagnosticos = async () => {
    let response = await diagnosticoRepository.get(idEpElegido);

    if (response) {
      setDiagnosticos(response.data);
    }
  };

  // Funcion que obtiene la lista de evolucion de un paciente
  const getEvoluciones = async () => {
    let response = await evolucionRepository.get(idEpElegido);

    if (response) {
      setEvoluciones(response.data);
    }
  };

  // Funcion que obtiene la lista de obras sociales de un paciente
  const getOs = async () => {
    let response = await osRepository.get(idEpElegido);

    if (response) {
      setOsociales(response.data);
    }
  };

  // Funcion que obtiene la lista de indicaciones de un paciente
  const getIndicaciones = async () => {
    let response = await indicacionRepository.get(idEpElegido);

    if (response) {
      setIndicaciones(response.data);
    }
  };

  return (
    <main
      className={
        'border-top-sm m-0 row justify-content-center form-paciente m-md-3 rounded shadow container-lg mx-md-auto ' +
        styles.pageHeader
      }
    >
      <div className="mb-4 col-12 col-md-9 col-lg-12 col-xl-10">
        <h3 className="mt-4">
          <b>Ficha Médica</b>
        </h3>
        <hr />
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 col-xl-12">
            <h5>
              <b>Nombre y Apellido:</b> {nombreEpElegido}
            </h5>
          </div>
        </div>

        <div className={'row ' + styles.sectionRow}>
          <div className="col-6 col-md-6 col-lg-6 col-xl-6">
            <h4 className="mt-4">Diagnósticos</h4>
          </div>
          <div className={'mb-4 col-6 col-md-6 col-lg-6 col-xl-6 ' + styles.sectionActions}>
            <Link to={'/list-diagnostico'}>
              <button className="btn btn-verde" to={'/list-diagnostico'}>
                Editar
              </button>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <table
              className={
                'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
              }
            >
              <thead>
                <tr>
                  <th scope="col">Nombre de Enfermedad</th>
                  <th scope="col">Fecha de Diagnóstico</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {diagnosticos &&
                  diagnosticos
                    .filter((diagnostico) => diagnostico.borrado === 0)
                    .map((diagnostico, index) => (
                      <tr key={diagnostico.iddiagnostico}>
                        <td>{diagnostico.idenfermedad.nombre}</td>
                        <td>{utils.convertirFormatoFecha(diagnostico.fecha)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={'row ' + styles.sectionRow}>
          <div className="col-6 col-md-6 col-lg-6 col-xl-6">
            <h4 className="mt-4">Evolución</h4>
          </div>
          <div className={'mb-4 col-6 col-md-6 col-lg-6 col-xl-6 ' + styles.sectionActions}>
            <Link to={'/list-evolucion'}>
              <button className="btn btn-verde" to={'/list-evolucion'}>
                Editar
              </button>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <table
              className={
                'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
              }
            >
              <thead>
                <tr>
                  <th scope="col">Estado Evolutivo</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Fecha de Observación</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {evoluciones &&
                  evoluciones
                    .filter((evolucion) => evolucion.borrado === 0)
                    .map((evolucion, index) => (
                      <tr key={evolucion.idevolucion}>
                        <td>Estado: {evolucion.escalaevolucion}</td>
                        <td>{utils.describirEstado(evolucion.escalaevolucion)}</td>
                        <td>{utils.convertirFormatoFecha(evolucion.fecha)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={'row ' + styles.sectionRow}>
          <div className="col-6 col-md-6 col-lg-6 col-xl-6">
            <h4 className="mt-4">Obra Social</h4>
          </div>
          <div className={'mb-4 col-6 col-md-6 col-lg-6 col-xl-6 ' + styles.sectionActions}>
            <Link to={'/list-obrasocial'}>
              <button className="btn btn-verde" to={'/list-obrasocial'}>
                Editar
              </button>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <table
              className={
                'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
              }
            >
              <thead>
                <tr>
                  <th scope="col">Obra Social</th>
                  <th scope="col">Tipo</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {osociales &&
                  osociales
                    .filter((osocial) => osocial.borrado === 0)
                    .map((osocial, index) => (
                      <tr key={osocial.idos}>
                        <td>{osocial.idobrasocial.nombre}</td>
                        <td>{utils.convertirTipo(osocial.idobrasocial.esestatal)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={'row ' + styles.sectionRow}>
          <div className="col-6 col-md-6 col-lg-6 col-xl-6">
            <h4 className="mt-4">Indicación de Medicamentos</h4>
          </div>
          <div className={'mb-4 col-6 col-md-6 col-lg-6 col-xl-6 ' + styles.sectionActions}>
            <Link to={'/list-indicacion'}>
              <button className="btn btn-verde" to={'/list-indicacion'}>
                Editar
              </button>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <table
              className={
                'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
              }
            >
              <thead>
                <tr>
                  <th scope="col">Nombre de Medicamento</th>
                  <th scope="col">Dosis en mg</th>
                  <th scope="col">Hora de Toma</th>
                  <th scope="col">Fecha de Prescripción</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {indicaciones &&
                  indicaciones
                    .filter((indicacion) => indicacion.borrado === 0)
                    .map((indicacion, index) => (
                      <tr key={indicacion.idindicacion}>
                        <td>{indicacion.idmedicamento.nombre}</td>
                        <td>{indicacion.cantidadmiligramos} mg</td>
                        <td>Cada {utils.convertirFormatoHora(indicacion.horadetoma)} hs</td>
                        <td>{utils.convertirFormatoFecha(indicacion.fechaprescripcion)}</td>
                        <td>{utils.convertirEstado(indicacion.estavigente)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FichaMedica;
