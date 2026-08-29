import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form } from 'react-bootstrap';
import { encuentroRepository } from '../services/encuentro.service';
import { pacienteRepository } from '../services/paciente.service';
import { asistenciaRepository } from '../services/asistencia.service';
import { eventRespository } from '../services/event.service';
import { showToast } from '../services/notification.service';
import { logAsyncError } from './error-boundary/logError';
import utils from '../utils/utils';
import styles from '../styles/asistencia-taller.module.css';

const ESTADO_PRESENTE = 'Presente';
const ESTADO_AUSENTE = 'Ausente';

const Asistencia = () => {
  const [encuentro, setEncuentro] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [evento, setEvento] = useState([]);

  const formAsistencia = useForm();

  useEffect(() => {
    let activo = true;
    getEncuentroAll(() => activo);
    getPacientes(() => activo);
    getEventoAll(() => activo);
    return () => {
      activo = false;
    };
  }, []);

  const getEncuentroAll = async (isActivo = () => true) => {
    try {
      const resp = await encuentroRepository.getEncuentroAll();
      if (!isActivo()) return;
      if (resp.success) {
        setEncuentro(resp.data.results);
      }
    } catch (error) {
      logAsyncError(error, { context: 'obtener encuentros' });
    }
  };

  const getPacientes = async (isActivo = () => true) => {
    try {
      const resp = await pacienteRepository.getPacientesEp();
      if (!isActivo()) return;
      if (resp.success) {
        setPacientes(resp.data.results ?? resp.data);
      }
    } catch (error) {
      logAsyncError(error, { context: 'obtener pacientes' });
    }
  };

  const getEventoAll = async (isActivo = () => true) => {
    try {
      const resp = await eventRespository.getEventGestionAll();
      if (!isActivo()) return;
      if (resp.success) {
        setEvento(resp.data.results);
      }
    } catch (error) {
      logAsyncError(error, { context: 'obtener eventos' });
    }
  };

  const clear = () => {
    formAsistencia.reset();
    setPacientes(
      pacientes.map((persona) => ({
        ...persona,
        checked: false,
        justificado: false,
      }))
    );
  };

  // Guarda la asistencia del día (lote bulk)
  const guardarAsistencia = async (data) => {
    try {
      const asistenciaData = pacientes.map((paciente) => ({
        idpersonaep: paciente.idpersona,
        idclasetaller: Number(data.fechaEncuentro),
        estado: paciente.checked ? ESTADO_PRESENTE : ESTADO_AUSENTE,
      }));

      const resp = await asistenciaRepository.createAsistencia(asistenciaData);
      if (resp.success) {
        showToast('success', 'Se ha guardado con éxito');
        formAsistencia.reset();
        setPacientes(
          pacientes.map((persona) => ({
            ...persona,
            checked: false,
            justificado: false,
          }))
        );
      }
    } catch (error) {
      logAsyncError(error, { context: 'guardar asistencia' });
    }
  };

  // Al seleccionar un encuentro, marca los pacientes cuyo evento cae en el rango de fechas
  const handleEncuentroChange = (e) => {
    const selectedEncuentroId = Number(e.target.value);
    const encuentroSeleccionado = encuentro.find(
      (enc) => Number(enc.idclasetaller) === selectedEncuentroId
    );

    if (encuentroSeleccionado) {
      const fechaEncuentro = new Date(encuentroSeleccionado.fecha);

      const updatedPacientes = pacientes.map((persona) => {
        const eventosPersona = evento.filter(
          (ev) => Number(ev.idpersonaep) === Number(persona.idpersona)
        );

        const isDateInRange = eventosPersona.some((eventoItem) => {
          const fechaDesde = new Date(eventoItem.fechadesde);
          const fechaHasta = new Date(eventoItem.fechahasta);
          return fechaEncuentro >= fechaDesde && fechaEncuentro <= fechaHasta;
        });

        return {
          ...persona,
          justificado: isDateInRange,
        };
      });
      setPacientes(updatedPacientes);
    }
  };

  // Toggle del checkbox de asistencia (fix: compara el id numérico, no el objeto)
  const handleAsistenciaCheck = (idpersona) => {
    setPacientes(
      pacientes.map((persona) =>
        persona.idpersona === idpersona ? { ...persona, checked: !persona.checked } : persona
      )
    );
  };

  const fechaRegister = formAsistencia.register('fechaEncuentro', {
    required: 'Debe elegir un encuentro.',
  });

  return (
    <Container className="container panel-gris">
      <h2 className="mt-4 text-center">Asistencia</h2>
      <hr />
      <div className="col-md-3">
        <Form.Group className="mb-0">
          <label htmlFor="fechaEncuentro" className="control-label">
            Encuentro:
          </label>
          <select
            className="form-select"
            placeholder="Elija el encuentro"
            id="fechaEncuentro"
            {...fechaRegister}
            onChange={(e) => {
              fechaRegister.onChange(e);
              handleEncuentroChange(e);
            }}
          >
            <option value="">Elija el encuentro</option>
            {encuentro.map((element) => (
              <option key={element.idclasetaller} value={element.idclasetaller}>
                {utils.convertirFormatoFecha(element.fecha)}
              </option>
            ))}
          </select>
          {formAsistencia.formState.errors.fechaEncuentro && (
            <small className="text-danger">
              {formAsistencia.formState.errors.fechaEncuentro.message}
            </small>
          )}
        </Form.Group>
      </div>
      <div className="row m-md-3 shadow mx-md-auto border-top-sm m-0 justify-content-center rounded container-lg ">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Persona con EP</th>
              <th scope="col">Asistencia</th>
              <th scope="col">Justificado</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((element) => (
              <tr key={element.idpersona}>
                <td>{element.idpersona}</td>
                <td>{`${element.nombre} ${element.apellido}`}</td>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="asistencia"
                    id={`asistencia-${element.idpersona}`}
                    value={element.idpersona}
                    checked={element.checked || false}
                    onChange={() => handleAsistenciaCheck(element.idpersona)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`justificado-${element.idpersona}`}
                    value={element.idpersona}
                    checked={element.justificado || false}
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={`mb-4 col-12 col-md-6 col-lg-4 col-xl-4 ${styles.buttonContainer}`}>
          <button
            type="button"
            className={`btn btn-rojo ${styles.actionButton}`}
            onClick={() => clear()}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`btn btn-verde ${styles.saveButton}`}
            onClick={() => formAsistencia.handleSubmit(guardarAsistencia)()}
          >
            Guardar
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Asistencia;
