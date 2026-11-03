import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form } from 'react-bootstrap';
import { encuentroRepository } from '../services/encuentro.service';
import { pacienteRepository } from '../services/paciente.service';
import { asistenciaRepository } from '../services/asistencia.service';
import { showToast } from '../services/notification.service';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import utils from '../utils/utils';
import styles from '../styles/asistencia-taller.module.css';

const ESTADO_PRESENTE = 'Presente';
const ESTADO_AUSENTE = 'Ausente';

const Asistencia = () => {
  const [encuentro, setEncuentro] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [selectedEncuentroId, setSelectedEncuentroId] = useState(null);

  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formAsistencia = useForm();

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    Promise.all([getEncuentroAll(), getPacientes()])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recargar = () => {
    setLoadError(null);
    Promise.all([getEncuentroAll(), getPacientes()]).catch(() => {});
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
      setPacientes(resp.data.filter((paciente) => paciente.activo !== false));
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  const clear = () => {
    formAsistencia.reset({ fechaEncuentro: '' });
    setSelectedEncuentroId(null);
    setPacientes(
      pacientes.map((persona) => ({
        ...persona,
        checked: false,
        justificada: false,
      }))
    );
  };

  const guardarAsistencia = async (data) => {
    const encuentroId = Number(data.fechaEncuentro);

    const items = pacientes
      .map((paciente) => ({
        persona_ep: paciente.id_persona,
        encuentro: encuentroId,
        estado: paciente.checked ? ESTADO_PRESENTE : ESTADO_AUSENTE,
      }))
      .filter((item) => item.persona_ep != null && Number.isFinite(item.encuentro));

    if (items.length === 0) return;

    for (const item of items) {
      const resp = await asistenciaRepository.createAsistencia(item);
      if (!resp.success) return;
    }

    showToast('success', 'Se ha guardado con éxito');
    clear();
  };

  const handleEncuentroChange = async (e) => {
    if (e.target.value === '') {
      setSelectedEncuentroId(null);
      return;
    }

    const encuentroId = Number(e.target.value);
    const encuentroSeleccionado = encuentro.find((enc) => Number(enc.id_encuentro) === encuentroId);

    if (encuentroSeleccionado) {
      const resp = await asistenciaRepository.getRosterEncuentro(encuentroId);
      if (!resp.success) {
        setLoadError(resp.error);
        return;
      }
      setLoadError(null);

      const roster = resp.data;
      setSelectedEncuentroId(encuentroId);

      const updatedPacientes = pacientes.map((persona) => {
        const filaRoster = roster.find(
          (item) => Number(item.persona_ep) === Number(persona.id_persona)
        );

        return {
          ...persona,
          checked: filaRoster ? filaRoster.estado === ESTADO_PRESENTE : false,
          justificada: filaRoster?.justificada === true,
        };
      });
      setPacientes(updatedPacientes);
    }
  };

  // Toggle del checkbox de asistencia (fix: compara el id numérico, no el objeto)
  const handleAsistenciaCheck = (idpersona) => {
    setPacientes(
      pacientes.map((persona) =>
        persona.id_persona === idpersona ? { ...persona, checked: !persona.checked } : persona
      )
    );
  };

  const fechaRegister = formAsistencia.register('fechaEncuentro', {
    required: 'Debe elegir un encuentro.',
  });

  const pacientesVisibles = selectedEncuentroId === null ? [] : pacientes;

  return (
    <Container className="container panel-gris">
      <h2 className="mt-4 text-center">Asistencia</h2>
      <hr />
      <div className="col-12 col-md-3">
        <Form.Group className="mb-0">
          <select
            className="form-select"
            placeholder="Seleccione el encuentro"
            id="fechaEncuentro"
            {...fechaRegister}
            onChange={(e) => {
              fechaRegister.onChange(e);
              handleEncuentroChange(e);
            }}
          >
            <option value="">Seleccione el encuentro</option>
            {encuentro.map((element) => (
              <option key={element.id_encuentro} value={element.id_encuentro}>
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
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Apellido</th>
                <th scope="col">Nombre</th>
                <th scope="col">Asistencia</th>
                <th scope="col">Justificada</th>
              </tr>
            </thead>
            <tbody>
              {pacientesVisibles.map((element) => (
                <tr key={element.id_persona}>
                  <td data-th="Apellido">{element.apellido}</td>
                  <td data-th="Nombre">{element.nombre}</td>
                  <td data-th="Asistencia">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="asistencia"
                      id={`asistencia-${element.id_persona}`}
                      value={element.id_persona}
                      checked={element.checked || false}
                      onChange={() => handleAsistenciaCheck(element.id_persona)}
                    />
                  </td>
                  <td data-th="Justificada">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`justificada-${element.id_persona}`}
                      value={element.id_persona}
                      checked={!element.checked && (element.justificada || false)}
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`mb-4 col-12 col-md-6 col-lg-4 col-xl-4 ${styles.buttonContainer}`}>
          <button
            type="button"
            className={`btn btn-verde ${styles.saveButton}`}
            onClick={() => formAsistencia.handleSubmit(guardarAsistencia)()}
          >
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-celeste ms-3"
            style={{ width: '40%' }}
            onClick={() => clear()}
          >
            Limpiar
          </button>
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
  );
};

export default Asistencia;
