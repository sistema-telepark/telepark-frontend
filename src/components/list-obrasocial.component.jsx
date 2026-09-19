import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import { obrasocialRepository } from '../services/obrasocial.service';
import { osRepository } from '../services/os.service';
import { showToast } from '../services/notification.service';
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

  const [loadError, setLoadError] = useState(null);

  const formNuevo = useForm();
  const formEdit = useForm();

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
  }, [idEpElegido, navigate]);

  const recargar = () => {
    setLoadError(null);
    Promise.all([getObrasocial(), getOs()]).catch(() => {});
  };

  const getObrasocial = async () => {
    const response = await obrasocialRepository.getAll();
    if (response?.success) {
      setObraSociales(response.data);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar las obras sociales.');
    }
  };

  const getOs = async () => {
    if (!idEpElegido) return;

    const response = await osRepository.get(idEpElegido);
    if (response?.success) {
      setOsociales(response.data.results ?? response.data);
      setLoadError(null);
    } else {
      setLoadError(response?.error || 'No se pudieron cargar las obras sociales.');
    }
  };

  const agregar = () => {
    formNuevo.reset({ obrasocial: '' });
    setShow(false);
    setShowNuevo(true);
  };

  const editar = (obrasocial, idos) => {
    setIdEditado(idos);
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
      idpersonaep: Number(idEpElegido),
      idobrasocial: Number(data.obrasocial),
      borrado: false,
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
      idpersonaep: Number(idEpElegido),
      idobrasocial: Number(data.obrasocial),
      borrado: false,
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
    const data = {
      idpersonaep: Number(idEpElegido),
      idobrasocial: Number(info.idobrasocial),
      borrado: true,
    };
    const response = await osRepository.update(id, data);
    if (response?.success) {
      getOs();
      showToast('success', 'Eliminado con éxito');
      setShow(false);
    }
  };

  return (
    <main className="container panel-gris">
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
          <button type="button" className="btn btn-azul" onClick={() => agregar()}>
            <PlusIcon />
            Agregar
          </button>
        </div>
      </div>

      <Modal show={showNuevo}>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Cargar Obra Social</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-6 col-xl-6">
              <label className="col-form-label">Obra Social</label>
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
                    <option value={obrasocial.idobrasocial} key={obrasocial.idobrasocial}>
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

      <Modal show={show}>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Editar Obra Social</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-6 col-xl-6">
              <label className="col-form-label">Obra Social</label>
              <select
                className="form-select"
                id="obrasocial"
                {...formEdit.register('obrasocial', {
                  required: 'Debe seleccionar una obra social.',
                })}
              >
                <option value="">Elegir</option>
                {obrasociales &&
                  obrasociales.map((obrasocial) => (
                    <option value={obrasocial.idobrasocial} key={obrasocial.idobrasocial}>
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
          <table className="table table-bordered table-hover shadow table-striped">
            <thead>
              <tr>
                <th scope="col">Obra Social</th>
                <th scope="col">Tipo</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody className={styles.tableBodyMiddle}>
              {osociales &&
                osociales
                  .filter((osocial) => osocial.borrado === false)
                  .map((osocial) => (
                    <tr key={osocial.idos}>
                      <td>{osocial.idobrasocial.nombre}</td>
                      <td>{utils.convertirTipo(osocial.idobrasocial.esestatal)}</td>
                      <td>
                        <button
                          type="button"
                          className={'btn btn-verde ' + styles.rowActionButton}
                          onClick={() => editar(osocial.idobrasocial.idobrasocial, osocial.idos)}
                        >
                          <PencilIcon />
                        </button>

                        <button
                          type="button"
                          className="btn btn-rojo"
                          onClick={() =>
                            utils.notificacionEliminar(
                              { idobrasocial: osocial.idobrasocial.idobrasocial },
                              osocial.idos,
                              eliminar
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
              message="No se pudieron cargar las obras sociales. Intente nuevamente."
            />
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

export default connect(mapStateToProps)(ListaObraSocial);
