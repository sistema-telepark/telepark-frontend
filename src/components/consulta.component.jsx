import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { tallerRepository } from '../services/taller.service';
import { actividadRepository } from '../services/actividad.service';
import { encuentroRepository } from '../services/encuentro.service';
import { pacienteRepository } from '../services/paciente.service';
import { asistenciaRepository } from '../services/asistencia.service';
import { eventRespository } from '../services/event.service';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import utils from '../utils/utils';
import styles from '../styles/consulta.module.css';

const ESTADO_AUSENTE = 'Ausente';

const Consulta = () => {
  const [taller, setTaller] = useState([]);
  const [encuentro, setEncuentro] = useState([]);
  const [act, setAct] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [faltaC, setFaltaC] = useState([]);

  const [mensajeSinDatos, setMensajeSinDatos] = useState(false);
  const [mensajeSinDatosFC, setMensajeSinDatosFC] = useState(false);
  const [errores, setErrores] = useState({});

  const [evento, setEvento] = useState([]);
  const [loadError, setLoadError] = useState(null);

  const recargar = () => {
    getTallerAll();
    getActividades();
    getEncuentroAll();
    getPacientes();
    getEventoAll();
  };

  const [form, setForm] = useState({
    fechaEncuentro: '',
  });

  useEffect(() => {
    getTallerAll();
    getActividades();
    getEncuentroAll();
    getPacientes();
    getEventoAll();
  }, []);

  const getTallerAll = async () => {
    const resp = await tallerRepository.getTallerAll();
    if (resp.success) {
      setTaller(resp.data.results);
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  const getActividades = async () => {
    const resp = await actividadRepository.getAll();
    if (resp.success) {
      setAct(resp.data.results);
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  const getEncuentroAll = async () => {
    const resp = await encuentroRepository.getEncuentroAll();
    if (resp.success) {
      setEncuentro(resp.data.results);
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  const getPacientes = async () => {
    const resp = await pacienteRepository.getPacientesEp();
    if (resp.success) {
      setPacientes(resp.data.results ?? resp.data);
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  const getEventoAll = async () => {
    const resp = await eventRespository.getEventGestionAll();
    if (resp.success) {
      setEvento(resp.data.results);
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const consultarAsistencia = async () => {
    if (!form.fechaEncuentro) {
      setErrores({ fecha: 'Debe elegir un encuentro.' });
      setAsistencia([]);
      return;
    }
    setErrores({});

    const resp = await asistenciaRepository.getAsistenciaByEncuentro(form.fechaEncuentro);
    if (resp.success) {
      setAsistencia(resp.data);
      setMensajeSinDatos(resp.data.length === 0);
    } else {
      setAsistencia([]);
      setMensajeSinDatos(true);
    }
  };

  const consultarFaltasC = async () => {
    const respAsistencias = await asistenciaRepository.getAsistenciaAll();
    const respPacientes = await pacienteRepository.getPacientesEp();
    const respEncuentros = await encuentroRepository.getEncuentroAll();

    if (!respAsistencias.success || !respPacientes.success || !respEncuentros.success) {
      setFaltaC([]);
      setMensajeSinDatosFC(true);
      return;
    }

    const asistencias = respAsistencias.data.results;
    const pacientes = respPacientes.data.results;
    const encuentros = respEncuentros.data.results;

    // Ordenar encuentros por fecha (del más reciente al más antiguo)
    const encuentrosOrdenados = [...encuentros].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );
    const ultimosDosEncuentros = encuentrosOrdenados.slice(0, 2).map((enc) => enc.idclasetaller);

    // Filtrar asistencias de los últimos dos encuentros con estado Ausente
    const asistenciasFiltradas = asistencias.filter(
      (asistenciaItem) =>
        ultimosDosEncuentros.includes(asistenciaItem.idclasetaller) &&
        asistenciaItem.estado === ESTADO_AUSENTE
    );

    // Agrupar asistencias por paciente
    const faltasPorPaciente = asistenciasFiltradas.reduce((acc, asistenciaItem) => {
      const { idpersonaep } = asistenciaItem;
      if (!acc[idpersonaep]) {
        acc[idpersonaep] = 0;
      }
      acc[idpersonaep]++;
      return acc;
    }, {});

    // Filtrar pacientes con faltas en ambos encuentros
    const pacientesConFaltasConsecutivas = Object.entries(faltasPorPaciente)
      .filter(([, count]) => count === 2)
      .map(([idpersonaep]) => idpersonaep);

    const pacientesFiltrados = pacientes.filter((paciente) =>
      pacientesConFaltasConsecutivas.includes(String(paciente.idpersona))
    );

    setFaltaC(pacientesFiltrados);
    setMensajeSinDatosFC(pacientesFiltrados.length === 0);
  };

  const obtenerNombre = (idpersonaep) => {
    const paciente = pacientes.find((p) => Number(p.idpersona) === Number(idpersonaep));
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido';
  };

  return (
    <>
      <Container className="container panel-gris">
        <h2 className="mt-4 text-center">Consultas</h2>
        <hr />
        {loadError && (
          <ErrorFallbackInline
            error={{ message: loadError }}
            resetErrorBoundary={recargar}
            message="Error al cargar los datos. Intente nuevamente."
          />
        )}

        <div
          className={`row m-md-3 mx-auto justify-content-center rounded container-lg ${styles.whiteCard}`}
        >
          <div className="col-md-6">
            <Form.Group className="mb-0">
              <select
                className="form-select"
                name="fechaEncuentro"
                id="fechaEncuentro"
                onChange={handleChange}
              >
                <option value="">Elija el encuentro</option>
                {encuentro.map((element) => (
                  <option key={element.idclasetaller} value={element.idclasetaller}>
                    {utils.convertirFormatoFecha(element.fecha)}
                  </option>
                ))}
              </select>
              {errores.fecha && <small className="text-danger">{errores.fecha}</small>}
            </Form.Group>
          </div>

          <div className={`mb-4 col-12 col-md-8 p-4 rounded shadow-sm ${styles.sectionCard}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Listado de asistencia</span>
              <button
                type="button"
                className={`btn btn-verde ${styles.actionButton}`}
                onClick={() => consultarAsistencia()}
              >
                Consultar
              </button>
            </div>

            <div className="col-12">
              {asistencia.length > 0 ? (
                <table className="table table-hover table-striped text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencia.map((item) => (
                      <tr key={item.idasistenciataller}>
                        <td>{obtenerNombre(item.idpersonaep)}</td>
                        <td>{item.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                mensajeSinDatos && (
                  <p className="text-center text-muted">No hay datos de asistencia disponibles.</p>
                )
              )}
            </div>
          </div>
        </div>

        <div
          className={`row m-md-3 mx-auto justify-content-center rounded container-lg ${styles.whiteCard}`}
        >
          <div className={`mb-4 col-12 col-md-8 p-4 rounded shadow-sm ${styles.sectionCard}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Lista de pacientes con faltas consecutivas</span>
              <button
                type="button"
                className={`btn btn-verde ${styles.actionButton}`}
                onClick={() => consultarFaltasC()}
              >
                Consultar
              </button>
            </div>

            <div className="col-12">
              {faltaC.length > 0 ? (
                <table className="table table-hover table-striped text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faltaC.map((paciente) => (
                      <tr key={paciente.idpersona}>
                        <td>
                          {paciente.nombre} {paciente.apellido}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                mensajeSinDatosFC && (
                  <p className="text-center text-muted">
                    No hay datos de pacientes con faltas consecutivas.
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Consulta;
