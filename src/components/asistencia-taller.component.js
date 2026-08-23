import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, FormGroup } from 'reactstrap';
import { encuentroRepository } from '../services/encuentro.service';
import { pacienteRepository } from '../services/paciente.service';
import { asistenciaRepository } from '../services/asistencia.service';
import { eventRespository } from '../services/event.service';
import { showToast } from '../services/notification.service';
import utils from '../utils/utils';
import styles from '../styles/asistencia-taller.module.css';

// Valores canónicos del estado de AsistenciaTaller (D-1/S10)
const ESTADO_PRESENTE = 'Presente';
const ESTADO_AUSENTE = 'Ausente';

const Asistencia = () => {
  const [encuentro, setEncuentro] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [evento, setEvento] = useState([]);

  const formAsistencia = useForm();

  useEffect(() => {
    getEncuentroAll();
    getPacientes();
    getEventoAll();
  }, []);

  const getEncuentroAll = async () => {
    const resp = await encuentroRepository.getEncuentroAll();
    if (resp.success) {
      setEncuentro(resp.data.results);
    }
  };

  const getPacientes = async () => {
    const resp = await pacienteRepository.getPacientesEp();
    if (resp.success) {
      setPacientes(resp.data.results ?? resp.data);
    }
  };

  const getEventoAll = async () => {
    const resp = await eventRespository.getEventGestionAll();
    if (resp.success) {
      setEvento(resp.data.results);
    }
  };

  // Limpia el select y desmarca todos los checkboxes (sin tocar backend)
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

  // Guardar la asistencia del día (lote bulk — RA-14)
  const guardarAsistencia = async (data) => {
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
        persona.idpersona === idpersona
          ? { ...persona, checked: !persona.checked }
          : persona
      )
    );
  };

  const fechaRegister = formAsistencia.register('fechaEncuentro', {
    required: 'Debe elegir un encuentro.',
  });

  return (
    <>
      <Container className="container panel-gris">
        <h2 className="mt-4 text-center">Asistencia</h2>
        <hr />
        <div className="col-md-3">
          <FormGroup>
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
          </FormGroup>
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
    </>
  );
};

export default Asistencia;
