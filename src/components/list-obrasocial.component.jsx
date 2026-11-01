import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import { obrasocialRepository } from '../services/obrasocial.service';
import { osRepository } from '../services/os.service';
import { showConfirm, showToast } from '../services/notification.service';
import { TokenService } from '../services/token.service';
import utils from '../utils/utils';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import styles from '../styles/list-obrasocial.module.css';

const ListaObraSocial = (props) => {
  const [show, setShow] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [idEditado, setIdEditado] = useState('');
  const [obrasociales, setObraSociales] = useState([]);
  const [osociales, setOsociales] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idEpElegido, nombreEpElegido } = props;
  const navigate = useNavigate();
  const isSuperuser = TokenService.getRole() === true;

  const [loadError, setLoadError] = useState(null);

  const formNuevo = useForm();
  const formEdit = useForm();

  const getOs = useCallback(async () => {
    if (!idEpElegido) return;

    const response = await osRepository.get(idEpElegido);
    if (response?.success) {
      setOsociales(response.data.results ?? response.data);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar las obras sociales.');
    }
  }, [idEpElegido]);

  const getObrasocial = async () => {
    const response = await obrasocialRepository.getAll();
    if (response?.success) {
      setObraSociales(response.data);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar las obras sociales.');
    }
  };

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    const cargarInicial = async () => {
      try {
        await Promise.all([getObrasocial(), getOs()]);
      } finally {
        setLoading(false);
      }
    };
    cargarInicial();
    if (!idEpElegido) {
      setOsociales([]);
      navigate('/list-pacientes', { replace: true });
    }
  }, [idEpElegido, navigate, getOs]);

  const recargar = () => {
    setLoadError(null);
    Promise.all([getObrasocial(), getOs()]).catch(() => {});
  };

  const agregar = () => {
    formNuevo.reset({ obrasocial: '' });
    setShow(false);
    setShowNuevo(true);
  };

  const editar = (obrasocial, id_cobertura) => {
    setIdEditado(id_cobertura);
    formEdit.reset({ obrasocial });
    setShow(true);
    setShowNuevo(false);
  };

  const cancelar = () => {
    formNuevo.reset();
    formEdit.reset();
    setShow(false);
    setShowNuevo(false);
  };

  const cargarNuevo = async (data) => {
    const payload = {
      persona_ep: Number(idEpElegido),
      obra_social: Number(data.obrasocial),
    };
    const response = await osRepository.create(payload);
    if (response?.success) {
      getOs();
      utils.notificacionGuardar();
      formNuevo.reset();
      setShowNuevo(false);
    }
  };

  const guardar = async (data) => {
    const payload = {
      persona_ep: Number(idEpElegido),
      obra_social: Number(data.obrasocial),
    };
    const response = await osRepository.update(idEditado, payload);
    if (response?.success) {
      getOs();
      utils.notificacionGuardar();
      formEdit.reset();
      setShow(false);
    }
  };

  const eliminar = async (info, id) => {
    const response = await osRepository.delete(id);
    if (response?.success) {
      getOs();
      showToast('success', 'Eliminado con éxito');
      setShow(false);
    }
  };

  const notificacionEliminar = async (info, id) => {
    const confirmado = await showConfirm({
      title: 'Estas seguro?',
      message: 'No podrás revertir esto!',
      confirmLabel: 'Sí',
      cancelLabel: 'No',
      variant: 'warning',
    });
    if (confirmado) {
      eliminar(info, id);
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
        <div className="row">
        <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12">
          <h3 className="mt-4">Obra Social de Persona con EP</h3>
          <hr />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
          <h5>
            <b>Nombre y Apellido:</b> {nombreEpElegido}
          </h5>
        </div>
        <div className={'col-12 col-md-6 col-lg-6 col-xl-6 ' + styles.textRight}>
          {isSuperuser && (
            <button type="button" className="btn btn-azul" onClick={() => agregar()}>
              <PlusIcon className="signoMas" />
              Agregar
            </button>
          )}
        </div>
      </div>

      <Modal show={showNuevo} scrollable>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Cargar Obra Social</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-6 col-xl-6">
              <label htmlFor="obrasocial" className="col-form-label">
                Obra Social
              </label>
              <select
                className="form-select"
                id="obrasocial"
                {...formNuevo.register('obrasocial', {
                  required: 'Debe seleccionar una obra social.',
                })}
              >
                <option value="">Elegir</option>
                {obrasociales &&
                  obrasociales.map((obrasocial) => (
                    <option value={obrasocial.id_obra_social} key={obrasocial.id_obra_social}>
                      {obrasocial.nombre}
                    </option>
                  ))}
              </select>
              {formNuevo.formState.errors.obrasocial && (
                <small className="text-danger" role="alert">
                  {formNuevo.formState.errors.obrasocial.message}
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

      <Modal show={show} scrollable>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Editar Obra Social</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-6 col-xl-6">
              <label htmlFor="obrasocialEdit" className="col-form-label">
                Obra Social
              </label>
              <select
                className="form-select"
                id="obrasocialEdit"
                {...formEdit.register('obrasocial', {
                  required: 'Debe seleccionar una obra social.',
                })}
              >
                <option value="">Elegir</option>
                {obrasociales &&
                  obrasociales.map((obrasocial) => (
                    <option value={obrasocial.id_obra_social} key={obrasocial.id_obra_social}>
                      {obrasocial.nombre}
                    </option>
                  ))}
              </select>
              {formEdit.formState.errors.obrasocial && (
                <small className="text-danger" role="alert">
                  {formEdit.formState.errors.obrasocial.message}
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
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <div className="table-responsive">
            <table
              className={
                'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
              }
            >
              <thead>
                <tr>
                  <th scope="col">Obra Social</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {osociales &&
                  osociales.map((osocial) => (
                      <tr key={osocial.id_cobertura}>
                        <td data-th="Obra Social">{osocial.obra_social.nombre}</td>
                        <td data-th="Tipo">
                          {utils.convertirTipo(osocial.obra_social.es_estatal)}
                        </td>
                        <td data-th="Acción">
                        {isSuperuser && (
                          <>
                            <button
                              type="button"
                              className={'btn btn-verde ' + styles.rowActionButton}
                              onClick={() =>
                                editar(osocial.obra_social.id_obra_social, osocial.id_cobertura)
                              }
                            >
                              <PencilIcon />
                            </button>

                            <button
                              type="button"
                              className="btn btn-rojo"
                              onClick={() =>
                                notificacionEliminar(
                                  { obra_social: osocial.obra_social.id_obra_social },
                                  osocial.id_cobertura
                                )
                              }
                            >
                              <TrashIcon />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          </div>
          {loading && <LoadingSpinner />}
          {loadError && (
            <ErrorFallbackInline
              error={{ message: loadError }}
              resetErrorBoundary={recargar}
              message="No se pudieron cargar las obras sociales. Intente nuevamente."
            />
          )}
        </div>
      </div>

        <div className="row justify-content-center mt-4">
          <div className="col-auto">
            <button type="button" className="btn btn-azul" onClick={() => navigate('/ficha')}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

ListaObraSocial.propTypes = {
  idEpElegido: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nombreEpElegido: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    idEpElegido: state.global.idEpElegido,
    nombreEpElegido: state.global.nombreEpElegido,
  };
};

export default connect(mapStateToProps)(ListaObraSocial);
