import React, { useEffect, useRef, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { tallerRepository } from '../services/taller.service';
import { actividadRepository } from '../services/actividad.service';
import { encuentroRepository } from '../services/encuentro.service';
import { pacienteRepository } from '../services/paciente.service';
import { asistenciaRepository } from '../services/asistencia.service';
import { reporteRepository } from '../services/reporte.service';
import { eventRespository } from '../services/event.service';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import utils from '../utils/utils';
import styles from '../styles/consulta.module.css';

const ESTADO_PRESENTE = 'Presente';
const ESTADO_AUSENTE = 'Ausente';

const toArray = (data) => (Array.isArray(data) ? data : (data?.results ?? []));

const Consulta = () => {
  const [, setTaller] = useState([]);
  const [encuentro, setEncuentro] = useState([]);
  const [, setAct] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [faltaC, setFaltaC] = useState([]);

  const [mensajeSinDatos, setMensajeSinDatos] = useState(false);
  const [mensajeSinDatosFC, setMensajeSinDatosFC] = useState(false);
  const [errores, setErrores] = useState({});

  const [, setEvento] = useState([]);

  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fechaEncuentro: '',
  });

  const rosterRequestRef = useRef(0);
  const faltasRequestRef = useRef(0);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    Promise.all([
      getTallerAll(),
      getActividades(),
      getEncuentroAll(),
      getEventoAll(),
      consultarFaltasC(),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recargar = () => {
    setLoadError(null);
    Promise.all([
      getTallerAll(),
      getActividades(),
      getEncuentroAll(),
      getEventoAll(),
      consultarFaltasC(),
    ]).catch(() => {});
  };

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
      setEncuentro(toArray(resp.data));
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
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (name === 'fechaEncuentro') {
      consultarAsistencia(value);
    }
  };

  const consultarAsistencia = async (idEncuentro) => {
    const requestId = ++rosterRequestRef.current;

    if (!idEncuentro) {
      setAsistencia([]);
      setMensajeSinDatos(false);
      setErrores({});
      return;
    }
    setErrores({});

    const [respRoster, respPacientes] = await Promise.all([
      asistenciaRepository.getRosterEncuentro(idEncuentro),
      pacienteRepository.getPacientesEp(),
    ]);

    if (requestId !== rosterRequestRef.current) return;

    if (!respRoster.success || !respPacientes.success) {
      setAsistencia([]);
      setMensajeSinDatos(false);
      setLoadError(
        !respRoster.success && respRoster.error ? respRoster.error : respPacientes.error
      );
      return;
    }

    const roster = toArray(respRoster.data);
    const datosPorPersona = new Map(
      respPacientes.data.map((paciente) => [
        Number(paciente.id_persona),
        { nombre: paciente.nombre, apellido: paciente.apellido },
      ])
    );

    const filas = roster.map((item) => {
      const datosPersona = datosPorPersona.get(Number(item.persona_ep));
      return {
        id_persona: item.persona_ep,
        nombre: datosPersona?.nombre ?? `Persona EP ${item.persona_ep}`,
        apellido: datosPersona?.apellido ?? '',
        estado: item.estado === ESTADO_PRESENTE ? ESTADO_PRESENTE : ESTADO_AUSENTE,
        justificada: item.justificada === true,
      };
    });

    filas.sort(
      (a, b) =>
        a.apellido.localeCompare(b.apellido, 'es', { sensitivity: 'base' }) ||
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

    setAsistencia(filas);
    setMensajeSinDatos(roster.length === 0);
    setLoadError(null);
  };

  const consultarFaltasC = async () => {
    const requestId = ++faltasRequestRef.current;

    const [respReporte, respPacientes] = await Promise.all([
      reporteRepository.getFaltasConsecutivas(),
      pacienteRepository.getPacientesEp(),
    ]);

    if (requestId !== faltasRequestRef.current) return;

    if (!respReporte.success || !respPacientes.success) {
      setFaltaC([]);
      setMensajeSinDatosFC(false);
      const primerError =
        !respReporte.success && respReporte.error ? respReporte.error : respPacientes.error;
      setLoadError(primerError);
      return;
    }

    const reporte = toArray(respReporte.data);
    const datosPorPersona = new Map(
      respPacientes.data.map((paciente) => [
        Number(paciente.id_persona),
        { nombre: paciente.nombre, apellido: paciente.apellido },
      ])
    );

    const filas = reporte.map((item) => {
      const datosPersona = datosPorPersona.get(Number(item.persona_ep));
      return {
        id_persona: item.persona_ep,
        apellido: datosPersona?.apellido ?? `Persona EP ${item.persona_ep}`,
        nombre: datosPersona?.nombre ?? '',
      };
    });

    filas.sort(
      (a, b) =>
        a.apellido.localeCompare(b.apellido, 'es', { sensitivity: 'base' }) ||
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

    setFaltaC(filas);
    setMensajeSinDatosFC(reporte.length === 0);
    setLoadError(null);
  };

  const limpiarAsistencia = () => {
    rosterRequestRef.current += 1;
    setAsistencia([]);
    setMensajeSinDatos(false);
    setErrores({});
    setForm({ fechaEncuentro: '' });
  };

  return (
    <>
      <Container className={`container panel-gris ${styles.flexMinWidth}`}>
        <h2 className="mt-4 text-center">Consultas</h2>
        <hr />

        <div className="row m-md-3 shadow mx-md-auto border-top-sm m-0 rounded">
          <div className={`col-12 col-md-8 p-3 ${styles.flexMinWidth}`}>
            <h5 className="mb-3">Listado de asistencia</h5>

            <div className="row g-2 align-items-center mb-3">
              <div className="col-12 col-md-6">
                <Form.Group className="mb-0">
                  <select
                    className="form-select"
                    placeholder="Seleccione el encuentro"
                    name="fechaEncuentro"
                    id="fechaEncuentro"
                    value={form.fechaEncuentro}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione el encuentro</option>
                    {encuentro.map((element) => (
                      <option key={element.id_encuentro} value={element.id_encuentro}>
                        {utils.convertirFormatoFecha(element.fecha)}
                      </option>
                    ))}
                  </select>
                  {errores.fecha && <small className="text-danger">{errores.fecha}</small>}
                </Form.Group>
              </div>
            </div>

            {asistencia.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Apellido</th>
                      <th>Nombre</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencia.map((item) => (
                      <tr key={item.id_persona}>
                        <td data-th="Apellido">{item.apellido}</td>
                        <td data-th="Nombre">{item.nombre}</td>
                        <td data-th="Estado">
                          {item.estado}
                          {item.estado === ESTADO_AUSENTE && item.justificada
                            ? ' · Justificada'
                            : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              mensajeSinDatos && (
                <p className="text-center text-muted">No hay PersonaEP activas para consultar.</p>
              )
            )}

            <div className={`mb-4 ${styles.buttonContainer}`}>
              <button
                type="button"
                className="btn btn-celeste"
                style={{ width: '20%' }}
                onClick={() => limpiarAsistencia()}
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className={`col-12 col-md-4 p-3 ${styles.columnDivider} ${styles.flexMinWidth}`}>
            <h5 className="mb-3">Inasistencias consecutivas</h5>

            {faltaC.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Apellido</th>
                      <th>Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faltaC.map((paciente) => (
                      <tr key={paciente.id_persona}>
                        <td data-th="Apellido">{paciente.apellido}</td>
                        <td data-th="Nombre">{paciente.nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              mensajeSinDatosFC && (
                <p className="text-center text-muted">
                  No hay datos de pacientes con 3 faltas consecutivas.
                </p>
              )
            )}
          </div>
        </div>
        {loading && <LoadingSpinner />}
        {loadError && (
          <ErrorFallbackInline
            error={{ message: loadError }}
            resetErrorBoundary={recargar}
            message="Error al cargar los datos. Intente nuevamente."
          />
        )}
      </Container>
    </>
  );
};

export default Consulta;
