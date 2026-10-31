import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form, Modal } from 'react-bootstrap';
import { encuentroRepository } from '../services/encuentro.service';
import { encuentroTallerRepository } from '../services/encuentro-taller.service';
import { tallerRepository } from '../services/taller.service';
import { actividadRepository } from '../services/actividad.service';
import { actividadRealizadaRepository } from '../services/actividad-realizada.service';
import { showToast, showConfirm } from '../services/notification.service';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import utils from '../utils/utils';
import styles from '../styles/encuentro.module.css';

const normalizarSeleccion = (seleccion) => {
  if (Array.isArray(seleccion)) return seleccion.map(Number);
  if (seleccion === undefined || seleccion === null || seleccion === false || seleccion === '') {
    return [];
  }
  return [Number(seleccion)];
};

const Encuentro = () => {
  const [taller, setTaller] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [actividadRealizada, setActividadRealizada] = useState([]);
  const [encuentro, setEncuentro] = useState([]);
  const [encuentroSeleccionado, setEncuentroSeleccionado] = useState(null);
  const [encuentroEditando, setEncuentroEditando] = useState(null);

  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalInsertAct, setModalInsertAct] = useState(false);

  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formInsert = useForm();
  const formEdit = useForm();

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    Promise.all([getEncuentroAll(), getTallerAll(), getActividadAll()])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recargar = () => {
    setLoadError(null);
    Promise.all([getEncuentroAll(), getTallerAll(), getActividadAll()]).catch(() => {});
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

  const getTallerAll = async () => {
    const resp = await tallerRepository.getTallerAll();
    if (resp.success) {
      setTaller(resp.data.results);
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  const getActividadAll = async () => {
    const resp = await actividadRepository.getAll();
    if (resp.success) {
      setActividad(resp.data.results);
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  // Las actividades realizadas de una clase llegan como array plano
  const getActividadesRealizadas = async (id_encuentro) => {
    const resp = await actividadRealizadaRepository.getActividadesRealizadasByClase(id_encuentro);
    if (resp.success) {
      setActividadRealizada(resp.data);
      setLoadError(null);
    } else {
      setLoadError(resp.error);
    }
  };

  const handleActividadCheck = (idactividad) => {
    setActividad((prevActividades) =>
      prevActividades.map((act) =>
        act.id_actividad === idactividad ? { ...act, checked: !act.checked } : act
      )
    );
  };

  const talleresDelEncuentro = (encuentroSeleccionado?.talleres ?? []).map((t) =>
    Number(t.taller)
  );

  const actividadesDelTaller = encuentroSeleccionado
    ? actividad.filter((act) => talleresDelEncuentro.includes(Number(act.taller)))
    : [];

  // Guardar o eliminar las actividades realizadas del encuentro según su estado
  const guardarActividadesSeleccionadas = async () => {
    const actividadesSeleccionadas = actividadesDelTaller.filter((act) => act.checked);

    const actividadesToSave = actividadesSeleccionadas
      .filter(
        (seleccionada) =>
          !actividadRealizada.some(
            (realizada) => realizada.actividad === seleccionada.id_actividad
          )
      )
      .map((actividadItem) => ({
        actividad: actividadItem.id_actividad,
        encuentro: encuentroSeleccionado.id_encuentro,
      }));

    const actividadesADeseleccionar = actividadRealizada.filter(
      (realizada) =>
        !actividadesSeleccionadas.some(
          (seleccionada) => seleccionada.id_actividad === realizada.actividad
        )
    );
    const idsActividadesADeseleccionar = actividadesADeseleccionar.map(
      (realizada) => realizada.id_encuentro_actividad
    );

    const createResults = await Promise.all(
      actividadesToSave.map((actividadItem) => actividadRealizadaRepository.create(actividadItem))
    );
    const deleteResults = await Promise.all(
      idsActividadesADeseleccionar.map((id) => actividadRealizadaRepository.delete(id))
    );

    const resultados = [...createResults, ...deleteResults];
    if (resultados.every((resp) => resp.success)) {
      showToast('success', 'Se ha guardado con éxito');
      setModalInsertAct(false);
      getActividadesRealizadas(encuentroSeleccionado.id_encuentro);
    }
  };

  const guardarNuevo = async (data) => {
    const resp = await encuentroRepository.createEncuentro({
      fecha: data.fecha,
      virtual: data.virtual,
    });
    if (!resp.success) return;

    const seleccionados = normalizarSeleccion(data.idtalleres);
    const asociaciones = await Promise.all(
      seleccionados.map((idTaller) =>
        encuentroTallerRepository.create({
          encuentro: resp.data.id_encuentro,
          taller: idTaller,
        })
      )
    );

    if (asociaciones.every((asociacion) => asociacion.success)) {
      showToast('success', 'Se ha guardado con éxito');
      setModalInsert(false);
      formInsert.reset();
      getEncuentroAll();
    }
  };

  const guardarEdicion = async (data) => {
    const resp = await encuentroRepository.updateEncuentro(encuentroEditando.id_encuentro, {
      fecha: data.fecha,
      virtual: data.virtual,
    });
    if (!resp.success) return;

    const asociacionesActuales = encuentroEditando.talleres ?? [];
    const idsActuales = asociacionesActuales.map((asociacion) => Number(asociacion.taller));
    const seleccionados = normalizarSeleccion(data.idtalleres);

    const aCrear = seleccionados.filter((idTaller) => !idsActuales.includes(idTaller));
    const aEliminar = asociacionesActuales.filter(
      (asociacion) => !seleccionados.includes(Number(asociacion.taller))
    );

    const creaciones = await Promise.all(
      aCrear.map((idTaller) =>
        encuentroTallerRepository.create({
          encuentro: encuentroEditando.id_encuentro,
          taller: idTaller,
        })
      )
    );
    const eliminaciones = await Promise.all(
      aEliminar.map((asociacion) => encuentroTallerRepository.delete(asociacion.id_encuentro_taller))
    );

    if ([...creaciones, ...eliminaciones].every((asociacion) => asociacion.success)) {
      showToast('success', 'Se ha guardado con éxito');
    }

    const idEncuentro = encuentroEditando.id_encuentro;
    setModalEdit(false);
    formEdit.reset();
    setEncuentroEditando(null);

    const refresco = await encuentroTallerRepository.getByEncuentro(idEncuentro);
    if (refresco.success) {
      setEncuentro((prevEncuentros) =>
        prevEncuentros.map((item) =>
          item.id_encuentro === idEncuentro ? { ...item, talleres: refresco.data } : item
        )
      );
    }
    getEncuentroAll();
  };

  const showModalInsert = () => {
    formInsert.reset({ fecha: '', virtual: true, idtalleres: [] });
    setModalInsert(true);
  };

  const handleModalInsert = () => {
    formInsert.reset();
    setModalInsert(false);
  };

  const showModalEdit = (data) => {
    setEncuentroEditando(data);
    formEdit.reset({
      fecha: data.fecha,
      virtual: data.virtual,
      idtalleres: (data.talleres ?? []).map((asociacion) => String(asociacion.taller)),
    });
    setModalEdit(true);
  };

  const handleModalEdit = () => {
    formEdit.reset();
    setEncuentroEditando(null);
    setModalEdit(false);
  };

  const eliminarEncuentro = async (data) => {
    const ok = await showConfirm(
      `¿Seguro que desea eliminar el encuentro con fecha: ${utils.convertirFormatoFecha(data.fecha)}?`,
      `Código: ${data.id_encuentro}`
    );
    if (!ok) {
      showToast('danger', 'Cancelado', { message: 'No se eliminaron registros' });
      return;
    }
    const resp = await encuentroRepository.deleteEncuentro(data.id_encuentro);
    if (resp.success) {
      showToast('success', 'Eliminado con éxito');
      setEncuentro(encuentro.filter((item) => item.id_encuentro !== data.id_encuentro));
    }
  };

  // Al cargar las actividades del encuentro, marca las previamente guardadas
  const showModalInsertAct = async (data) => {
    setEncuentroSeleccionado(data);
    setModalInsertAct(true);

    const resp = await actividadRealizadaRepository.getActividadesRealizadasByClase(
      data.id_encuentro
    );
    if (resp.success) {
      setActividadRealizada(resp.data);
      const talleresAsociados = (data.talleres ?? []).map((asociacion) =>
        Number(asociacion.taller)
      );
      const actividadesConEstado = actividad.map((act) => ({
        ...act,
        checked:
          talleresAsociados.includes(Number(act.taller)) &&
          resp.data.some((realizada) => realizada.actividad === act.id_actividad),
      }));
      setActividad(actividadesConEstado);
    } else {
      setLoadError(resp.error);
    }
  };

  const handleModalInsertAct = () => {
    setActividadRealizada([]);
    setModalInsertAct(false);
  };

  // Agrupa las actividades por taller; el nombre del taller será la clave
  const actividadesPorTaller = actividadesDelTaller.reduce((acc, actividadItem) => {
    const tallerObj = taller.find(
      (tallerItem) => tallerItem.id_taller === actividadItem.taller
    );
    const tallerNombre = tallerObj?.tipo_taller || 'Taller sin nombre';

    if (!acc[tallerNombre]) {
      acc[tallerNombre] = [];
    }
    acc[tallerNombre].push(actividadItem);
    return acc;
  }, {});

  const nombresTalleres = Object.keys(actividadesPorTaller).sort();

  return (
    <>
      <Container className="container panel-gris">
        <h2 className="mt-4 text-center">Encuentros</h2>
        <hr />
        <button type="button" className="btn btn-azul mb-2 mt-2" onClick={() => showModalInsert()}>
          <PlusIcon className="signoMas" />
          Agregar
        </button>
        <div className="row m-md-3 shadow mx-md-auto border-top-sm m-0">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Virtual</th>
                  <th scope="col">Taller</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {encuentro.map((element) => (
                  <tr key={element.id_encuentro}>
                    <td data-th="Fecha">{utils.convertirFormatoFecha(element.fecha)}</td>
                    <td data-th="Virtual">{element.virtual ? 'Sí' : ''}</td>
                    <td data-th="Taller">
                      {(element.talleres ?? [])
                        .map(
                          (asociacion) =>
                            taller.find(
                              (tallerItem) =>
                                Number(tallerItem.id_taller) === Number(asociacion.taller)
                            )?.tipo_taller
                        )
                        .filter(Boolean)
                        .join(', ') || 'Sin taller'}
                    </td>
                    <td data-th="Acción">
                    <button
                      type="button"
                      className="btn btn-verde me-2"
                      title="Editar"
                      onClick={() => showModalEdit(element)}
                    >
                      <PencilIcon />
                    </button>

                    <button
                      type="button"
                      className="btn btn-rojo me-2"
                      title="Borrar"
                      onClick={() => eliminarEncuentro(element)}
                    >
                      <TrashIcon />
                    </button>

                    <button
                      type="button"
                      className="btn btn-azul me-2"
                      title="Agregar actividades"
                      onClick={() => showModalInsertAct(element)}
                    >
                      <PlusIcon />
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>

      {loading && <LoadingSpinner />}
      {loadError && (
        <ErrorFallbackInline
          error={{ message: loadError }}
          resetErrorBoundary={recargar}
          message="Error al cargar los datos. Intente nuevamente."
        />
      )}

      <Modal show={modalInsert} scrollable>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Nuevo Encuentro</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12 col-md-6">
              <Form.Group className="mb-0">
                <div className="form-group mb-2">
                  <label htmlFor="fecha" className="control-label">
                    Fecha del encuentro
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha"
                    {...formInsert.register('fecha', {
                      required: 'La fecha no puede estar vacío.',
                    })}
                  />
                </div>
                {formInsert.formState.errors.fecha && (
                  <small className="text-danger">{formInsert.formState.errors.fecha.message}</small>
                )}
              </Form.Group>
            </div>

            <div className="col-12 col-md-6">
              <Form.Group className="mb-0">
                <div className="form-check">
                  <label htmlFor="virtual" className="form-check-label">
                    Virtual
                  </label>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="virtual"
                    {...formInsert.register('virtual')}
                  />
                </div>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-12">
              <Form.Group className="mb-0">
                <div className="form-group mb-2">
                  <span className="control-label d-block">Talleres</span>
                  {taller.map((element) => (
                    <div className="form-check" key={element.id_taller}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`idtaller-${element.id_taller}`}
                        value={String(element.id_taller)}
                        {...formInsert.register('idtalleres')}
                      />
                      <label
                        htmlFor={`idtaller-${element.id_taller}`}
                        className="form-check-label"
                      >
                        {element.tipo_taller}
                      </label>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-rojo" onClick={() => handleModalInsert()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde ms-3"
            onClick={() => formInsert.handleSubmit(guardarNuevo)()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalEdit} scrollable>
        <Modal.Header className="justify-content-center">
          <h4 className="mb-0">Editar encuentro</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12 col-md-12">
              <Form.Group className="mb-0">
                <label htmlFor="id_encuentro" className="control-label">
                  Código:
                </label>
                <input
                  type="text"
                  name="id_encuentro"
                  id="id_encuentro"
                  className="form-control"
                  readOnly
                  value={encuentroEditando ? encuentroEditando.id_encuentro : ''}
                />
              </Form.Group>
            </div>

            <div className="col-12 col-md-6">
              <Form.Group className="mb-0">
                <label htmlFor="fechaEdit" className="control-label">
                  Fecha de encuentro
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaEdit"
                  {...formEdit.register('fecha', { required: 'La fecha no puede estar vacío.' })}
                />
                {formEdit.formState.errors.fecha && (
                  <small className="text-danger">{formEdit.formState.errors.fecha.message}</small>
                )}
              </Form.Group>
            </div>

            <div className="col-12 col-md-6">
              <Form.Group className="mb-0">
                <div className="form-check">
                  <label htmlFor="virtualEdit" className="form-check-label">
                    Virtual
                  </label>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="virtualEdit"
                    {...formEdit.register('virtual')}
                  />
                </div>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-12">
              <Form.Group className="mb-0">
                <div className="form-group mb-2">
                  <span className="control-label d-block">Talleres</span>
                  {taller.map((element) => (
                    <div className="form-check" key={element.id_taller}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`idtallerEdit-${element.id_taller}`}
                        value={String(element.id_taller)}
                        {...formEdit.register('idtalleres')}
                      />
                      <label
                        htmlFor={`idtallerEdit-${element.id_taller}`}
                        className="form-check-label"
                      >
                        {element.tipo_taller}
                      </label>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-rojo" onClick={() => handleModalEdit()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde ms-3"
            onClick={() => formEdit.handleSubmit(guardarEdicion)()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalInsertAct} scrollable>
        <Modal.Header>
          <div>
            <h5>Actividades del encuentro:</h5>
            <div className="control-label">
              <div>
                {encuentroSeleccionado
                  ? utils.convertirFormatoFecha(encuentroSeleccionado.fecha)
                  : ''}
              </div>
              <h6>Código: {encuentroSeleccionado ? encuentroSeleccionado.id_encuentro : ''}</h6>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className={`col-12 col-md-12 col-lg-12 col-xl-12 ${styles.scrollContainer}`}>
              <div className="table-responsive">
                <table className="table table-bordered table-hover shadow table-striped">
                  <tbody>
                  {nombresTalleres.map((tallerNombre) => (
                    <React.Fragment key={tallerNombre}>
                      <tr>
                        <td colSpan="1" className={styles.groupHeader} data-th="Taller">
                          {tallerNombre}
                        </td>
                      </tr>

                      {actividadesPorTaller[tallerNombre].map((act) => (
                        <tr key={act.id_actividad}>
                          <td data-th="Actividad">{act.nombre}</td>
                          <td data-th="Seleccionada">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`actividad-${act.id_actividad}`}
                              value={act.id_actividad}
                              checked={act.checked || false}
                              onChange={() => handleActividadCheck(act.id_actividad)}
                            />
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button type="button" className="btn btn-rojo" onClick={() => handleModalInsertAct()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde ms-3"
            onClick={() => guardarActividadesSeleccionadas()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Encuentro;
