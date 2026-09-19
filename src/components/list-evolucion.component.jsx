import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import { evolucionRepository } from '../services/evolucion.service';
import { showConfirm, showToast } from '../services/notification.service';
import utils from '../utils/utils';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import styles from '../styles/list-evolucion.module.css';

const ListaEvolucion = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [idEditado, setIdEditado] = useState('');
  const [evoluciones, setEvoluciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(null);

  const formNuevo = useForm();
  const formEdit = useForm();

  useEffect(() => {
    if (!idEpElegido) {
      setEvoluciones([]);
      navigate('/list-pacientes', { replace: true });
      return;
    }
    getEvoluciones();
  }, [idEpElegido, navigate]);

  const getEvoluciones = async () => {
    setLoading(true);
    setLoadError(null);
    let response = await evolucionRepository.get(idEpElegido);

    if (response?.success) {
      setEvoluciones(response.data.results ?? response.data);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar las evoluciones.');
    }
    setLoading(false);
  };

  const editar = (nroEvolucion, fecha, idevolucion) => {
    setIdEditado(idevolucion);
    formEdit.reset({ nroEvolucion: String(nroEvolucion), fecha });
    setShow(true);
    setShowNuevo(false);
  };

  const guardar = (data) => {
    const payload = {
      escalaevolucion: Number(data.nroEvolucion),
      fecha: data.fecha,
      idpersonaep: Number(idEpElegido),
      borrado: false,
    };
    evolucionRepository.update(idEditado, payload).then((response) => {
      if (response?.success) {
        getEvoluciones();
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
    formNuevo.reset({ nroEvolucion: '', fecha: '' });
    setShowNuevo(true);
    setShow(false);
  };

  const cargarNuevo = (data) => {
    const payload = {
      escalaevolucion: Number(data.nroEvolucion),
      fecha: data.fecha,
      idpersonaep: Number(idEpElegido),
      borrado: false,
    };
    evolucionRepository.create(payload).then((response) => {
      if (response?.success) {
        getEvoluciones();
        showToast('success', 'Se ha guardado con éxito');
        formNuevo.reset();
        setShowNuevo(false);
      }
    });
  };

  const eliminar = (escalaevolucion, fecha, id) => {
    var data = {
      escalaevolucion: Number(escalaevolucion),
      fecha: fecha,
      idpersonaep: Number(idEpElegido),
      borrado: true,
    };
    evolucionRepository.update(id, data).then((response) => {
      if (response?.success) {
        getEvoluciones();
        showToast('success', 'Eliminado con éxito');
      }
    });
    setShow(false);
  };

  const notificacionEliminar = async (escalaevolucion, fecha, idEvolucion) => {
    const confirmado = await showConfirm({
      title: 'Estas seguro?',
      message: 'No podrás revertir esto!',
      confirmLabel: 'Sí',
      cancelLabel: 'No',
      variant: 'warning',
    });
    if (confirmado) {
      eliminar(escalaevolucion, fecha, idEvolucion);
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
        <h2 className="mt-4 text-center">Evolución de Persona con EP</h2>
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
            <h4 className="mb-0">Nueva Observación</h4>
          </Modal.Header>
          <Modal.Body>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Estado Evolutivo</label>
                <select
                  className="form-select"
                  id="nroEvolucion"
                  {...formNuevo.register('nroEvolucion', {
                    required: 'Debe seleccionar un estado evolutivo.',
                  })}
                >
                  <option value="">Elegir</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {formNuevo.formState.errors.nroEvolucion && (
                  <small className="text-danger" role="alert">
                    {formNuevo.formState.errors.nroEvolucion.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Observación</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  {...formNuevo.register('fecha', { required: 'Debe ingresar la fecha.' })}
                />
                {formNuevo.formState.errors.fecha && (
                  <small className="text-danger" role="alert">
                    {formNuevo.formState.errors.fecha.message}
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
            <h4 className="mb-0">Editar Observación</h4>
          </Modal.Header>
          <Modal.Body>
            <div className="row justify-content-center">
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Estado Evolutivo</label>
                <select
                  className="form-select"
                  id="nroEvolucion"
                  {...formEdit.register('nroEvolucion', {
                    required: 'Debe seleccionar un estado evolutivo.',
                  })}
                >
                  <option value="">Elegir</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {formEdit.formState.errors.nroEvolucion && (
                  <small className="text-danger" role="alert">
                    {formEdit.formState.errors.nroEvolucion.message}
                  </small>
                )}
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Observación</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  {...formEdit.register('fecha', { required: 'Debe ingresar la fecha.' })}
                />
                {formEdit.formState.errors.fecha && (
                  <small className="text-danger" role="alert">
                    {formEdit.formState.errors.fecha.message}
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
                  <th scope="col">Estado Evolutivo</th>
                  <th scope="col" className={styles.descriptionColumn}>
                    Descripción
                  </th>
                  <th scope="col">Fecha de Observación</th>
                  <th scope="col" className={styles.actionColumn}>
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {evoluciones &&
                  evoluciones
                    .filter((evolucion) => evolucion.borrado === false)
                    .map((evolucion) => (
                      <tr key={evolucion.idevolucion}>
                        <td>Estado: {evolucion.escalaevolucion}</td>
                        <td className={styles.descriptionColumn}>
                          {utils.describirEstado(evolucion.escalaevolucion)}
                        </td>
                        <td>{utils.convertirFormatoFecha(evolucion.fecha)}</td>
                        <td className={styles.actionColumn}>
                          <button
                            type="button"
                            className={'btn btn-verde ' + styles.rowActionButton}
                            onClick={() =>
                              editar(
                                evolucion.escalaevolucion,
                                evolucion.fecha,
                                evolucion.idevolucion
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
                                evolucion.escalaevolucion,
                                evolucion.fecha,
                                evolucion.idevolucion
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
                resetErrorBoundary={getEvoluciones}
                message="No se pudieron cargar las evoluciones. Intente nuevamente."
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(ListaEvolucion);
