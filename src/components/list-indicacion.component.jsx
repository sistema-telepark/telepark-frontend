import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import { indicacionRepository } from '../services/indicacion.service';
import { medicamentoRepository } from '../services/medicamento.service';
import { showConfirm, showToast } from '../services/notification.service';
import utils from '../utils/utils';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import styles from '../styles/list-indicacion.module.css';

const ListaIndicacion = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [idEditado, setIdEditado] = useState('');
  const [indicaciones, setIndicaciones] = useState([]);
  const [medicamentos, setMedicamentos] = useState();
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(null);

  const formNuevo = useForm();
  const formEdit = useForm();

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    const cargarInicial = async () => {
      try {
        await Promise.all([getIndicaciones(), getMedicamento()]);
      } finally {
        setLoading(false);
      }
    };
    cargarInicial();
    if (!idEpElegido) {
      setIndicaciones([]);
      navigate('/list-pacientes', { replace: true });
    }
  }, [idEpElegido, navigate]);

  const recargar = () => {
    setLoadError(null);
    Promise.all([getIndicaciones(), getMedicamento()]).catch(() => {});
  };

  const getIndicaciones = async () => {
    if (!idEpElegido) return;

    let response = await indicacionRepository.get(idEpElegido);

    if (response?.success && response?.data) {
      setIndicaciones(response.data.results ?? response.data);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar las indicaciones.');
    }
  };

  const getMedicamento = async () => {
    let response = await medicamentoRepository.getAll();

    if (response?.success && response?.data) {
      setMedicamentos(response.data);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar los medicamentos.');
    }
  };

  const editar = (dosis, estado, fecha, hora, medicamento, idindicacion) => {
    setIdEditado(idindicacion);
    formEdit.reset({
      medicamento,
      dosis,
      hora,
      fecha,
      estado: estado === true ? 'true' : 'false',
    });
    setShow(true);
    setShowNuevo(false);
  };

  const guardar = (data) => {
    const payload = {
      cantidadmiligramos: Number(data.dosis),
      estavigente: data.estado === 'true',
      fechaprescripcion: data.fecha,
      horadetoma: data.hora,
      idpersonaep: Number(idEpElegido),
      idmedicamento: Number(data.medicamento),
      borrado: false,
    };
    indicacionRepository.update(idEditado, payload).then((response) => {
      if (response?.success) {
        getIndicaciones();
        showToast('success', 'Se ha guardado con éxito');
        formEdit.reset();
        setShow(false);
      }
    });
  };

  const cancelar = () => {
    formNuevo.reset();
    formEdit.reset();
    setShow(false);
    setShowNuevo(false);
  };

  const agregar = () => {
    formNuevo.reset({ medicamento: '', dosis: '', hora: '', fecha: '', estado: '' });
    setShowNuevo(true);
    setShow(false);
  };

  const cargarNuevo = (data) => {
    const payload = {
      cantidadmiligramos: Number(data.dosis),
      estavigente: data.estado === 'true',
      fechaprescripcion: data.fecha,
      horadetoma: data.hora,
      idpersonaep: Number(idEpElegido),
      idmedicamento: Number(data.medicamento),
      borrado: false,
    };
    indicacionRepository.create(payload).then((response) => {
      if (response?.success) {
        getIndicaciones();
        showToast('success', 'Se ha guardado con éxito');
        formNuevo.reset();
        setShowNuevo(false);
      }
    });
  };

  const eliminar = (
    cantidadmiligramos,
    estavigente,
    fechaprescripcion,
    horadetoma,
    idmedicamento,
    id
  ) => {
    var data = {
      cantidadmiligramos: Number(cantidadmiligramos),
      estavigente: estavigente === true,
      fechaprescripcion: fechaprescripcion,
      horadetoma: horadetoma,
      idpersonaep: Number(idEpElegido),
      idmedicamento: Number(idmedicamento),
      borrado: true,
    };
    indicacionRepository.update(id, data).then((response) => {
      if (response?.success) {
        getIndicaciones();
        showToast('success', 'Eliminado con éxito');
      }
    });
    setShow(false);
  };

  const notificacionEliminar = async (
    cantidadmiligramos,
    estavigente,
    fechaprescripcion,
    horadetoma,
    idmedicamento,
    idIndicacion
  ) => {
    const confirmado = await showConfirm({
      title: 'Estas seguro?',
      message: 'No podrás revertir esto!',
      confirmLabel: 'Sí',
      cancelLabel: 'No',
      variant: 'warning',
    });
    if (confirmado) {
      eliminar(
        cantidadmiligramos,
        estavigente,
        fechaprescripcion,
        horadetoma,
        idmedicamento,
        idIndicacion
      );
    } else {
      showToast('danger', 'Cancelado', { message: 'No se eliminaron registros' });
    }
  };

  return (
    <main
      className={
        'border-top-sm m-0 row justify-content-center panel-gris m-md-3 rounded shadow container-lg mx-md-auto ' +
        styles.pageHeader
      }
    >
      <div className="mb-4 col-12 col-md-9 col-lg-12 col-xl-10">
        <h3 className="mt-4">Indicación de Medicamentos</h3>
        <hr />
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6 col-xl-6">
            <h5>
              <b>Nombre y Apellido:</b> {nombreEpElegido}
            </h5>
          </div>
          <div className={'mb-4 col-12 col-md-6 col-lg-6 col-xl-6 ' + styles.textRight}>
            <button type="button" className="btn btn-azul" onClick={() => agregar()}>
              <PlusIcon />
              Agregar
            </button>
          </div>
        </div>

        <Modal show={showNuevo}>
          <Modal.Header className="justify-content-center">
            <h4 className="mb-0">Nueva Indicación Médica</h4>
          </Modal.Header>
          <Modal.Body>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Nombre de Medicamento</label>
                <select
                  className="form-select"
                  id="medicamento"
                  {...formNuevo.register('medicamento', {
                    required: 'Debe seleccionar un medicamento.',
                  })}
                >
                  <option value="">Elegir</option>
                  {medicamentos &&
                    medicamentos.map((medicamento) => (
                      <option value={medicamento.idmedicamento} key={medicamento.idmedicamento}>
                        {medicamento.nombre}
                      </option>
                    ))}
                </select>
                {formNuevo.formState.errors.medicamento && (
                  <small className="text-danger" role="alert">
                    {formNuevo.formState.errors.medicamento.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Dosis</label>
                <input
                  type="number"
                  className="form-control"
                  id="dosis"
                  {...formNuevo.register('dosis', { required: 'Debe ingresar la dosis.' })}
                />
                {formNuevo.formState.errors.dosis && (
                  <small className="text-danger" role="alert">
                    {formNuevo.formState.errors.dosis.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Hora de Toma</label>
                <input
                  type="time"
                  className="form-control"
                  id="hora"
                  {...formNuevo.register('hora', { required: 'Debe ingresar la hora de toma.' })}
                />
                {formNuevo.formState.errors.hora && (
                  <small className="text-danger" role="alert">
                    {formNuevo.formState.errors.hora.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Prescripción</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  {...formNuevo.register('fecha', {
                    required: 'Debe ingresar la fecha de prescripción.',
                  })}
                />
                {formNuevo.formState.errors.fecha && (
                  <small className="text-danger" role="alert">
                    {formNuevo.formState.errors.fecha.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Estado</label>
                <select
                  className="form-select"
                  id="estado"
                  {...formNuevo.register('estado', { required: 'Debe seleccionar un estado.' })}
                >
                  <option value="">Elegir</option>
                  <option value="true">Vigente</option>
                  <option value="false">Caducado</option>
                </select>
                {formNuevo.formState.errors.estado && (
                  <small className="text-danger" role="alert">
                    {formNuevo.formState.errors.estado.message}
                  </small>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <button type="button" className="btn btn-rojo" onClick={() => cancelar()}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-verde ms-3"
              onClick={() => formNuevo.handleSubmit(cargarNuevo)()}
            >
              Guardar
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={show}>
          <Modal.Header className="justify-content-center">
            <h4 className="mb-0">Editar Indicación Médica</h4>
          </Modal.Header>
          <Modal.Body>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Nombre de Medicamento</label>
                <select
                  className="form-select"
                  id="medicamento"
                  {...formEdit.register('medicamento', {
                    required: 'Debe seleccionar un medicamento.',
                  })}
                >
                  <option value="">Elegir</option>
                  {medicamentos &&
                    medicamentos.map((medicamento) => (
                      <option value={medicamento.idmedicamento} key={medicamento.idmedicamento}>
                        {medicamento.nombre}
                      </option>
                    ))}
                </select>
                {formEdit.formState.errors.medicamento && (
                  <small className="text-danger" role="alert">
                    {formEdit.formState.errors.medicamento.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Dosis</label>
                <input
                  type="number"
                  className="form-control"
                  id="dosis"
                  {...formEdit.register('dosis', { required: 'Debe ingresar la dosis.' })}
                />
                {formEdit.formState.errors.dosis && (
                  <small className="text-danger" role="alert">
                    {formEdit.formState.errors.dosis.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Hora de Toma</label>
                <input
                  type="time"
                  className="form-control"
                  id="hora"
                  {...formEdit.register('hora', { required: 'Debe ingresar la hora de toma.' })}
                />
                {formEdit.formState.errors.hora && (
                  <small className="text-danger" role="alert">
                    {formEdit.formState.errors.hora.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Prescripción</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  {...formEdit.register('fecha', {
                    required: 'Debe ingresar la fecha de prescripción.',
                  })}
                />
                {formEdit.formState.errors.fecha && (
                  <small className="text-danger" role="alert">
                    {formEdit.formState.errors.fecha.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Estado</label>
                <select
                  className="form-select"
                  id="estado"
                  {...formEdit.register('estado', { required: 'Debe seleccionar un estado.' })}
                >
                  <option value="">Elegir</option>
                  <option value="true">Vigente</option>
                  <option value="false">Caducado</option>
                </select>
                {formEdit.formState.errors.estado && (
                  <small className="text-danger" role="alert">
                    {formEdit.formState.errors.estado.message}
                  </small>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <button type="button" className="btn btn-rojo" onClick={() => cancelar()}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-verde ms-3"
              onClick={() => formEdit.handleSubmit(guardar)()}
            >
              Guardar
            </button>
          </Modal.Footer>
        </Modal>

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
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {indicaciones &&
                  indicaciones
                    .filter((indicacion) => indicacion.borrado === false)
                    .map((indicacion) => (
                      <tr key={indicacion.idindicacion}>
                        <td>{indicacion.idmedicamento.nombre}</td>
                        <td>{indicacion.cantidadmiligramos} mg</td>
                        <td>Cada {utils.convertirFormatoHora(indicacion.horadetoma)} hs</td>
                        <td>{utils.convertirFormatoFecha(indicacion.fechaprescripcion)}</td>
                        <td>{utils.convertirEstado(indicacion.estavigente)}</td>
                        <td>
                          <button
                            type="button"
                            className={'btn btn-verde ' + styles.rowActionButton}
                            onClick={() =>
                              editar(
                                indicacion.cantidadmiligramos,
                                indicacion.estavigente,
                                indicacion.fechaprescripcion,
                                indicacion.horadetoma,
                                indicacion.idmedicamento.idmedicamento,
                                indicacion.idindicacion
                              )
                            }
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            className="btn btn-rojo"
                            onClick={() =>
                              notificacionEliminar(
                                indicacion.cantidadmiligramos,
                                indicacion.estavigente,
                                indicacion.fechaprescripcion,
                                indicacion.horadetoma,
                                indicacion.idmedicamento.idmedicamento,
                                indicacion.idindicacion
                              )
                            }
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {loading && <LoadingSpinner />}
            {loadError && (
              <ErrorFallbackInline
                error={{ message: loadError }}
                resetErrorBoundary={recargar}
                message="No se pudieron cargar las indicaciones. Intente nuevamente."
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListaIndicacion;
