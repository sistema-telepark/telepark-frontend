import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { encuentroRepository } from '../services/encuentro.service';
import { tallerRepository } from '../services/taller.service';
import { actividadRepository } from '../services/actividad.service';
import { actividadRealizadaRepository } from '../services/actividad-realizada.service';
import { showToast, showConfirm } from '../services/notification.service';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import utils from '../utils/utils';
import styles from '../styles/encuentro.module.css';

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

  const formInsert = useForm();
  const formEdit = useForm();

  useEffect(() => {
    getEncuentroAll();
    getTallerAll();
    getActividadAll();
  }, []);

  // Función que obtiene la lista de encuentros
  const getEncuentroAll = async () => {
    const resp = await encuentroRepository.getEncuentroAll();
    if (resp.success) {
      setEncuentro(resp.data.results);
    }
  };

  // Función que obtiene la lista de talleres
  const getTallerAll = async () => {
    const resp = await tallerRepository.getTallerAll();
    if (resp.success) {
      setTaller(resp.data.results);
    }
  };

  // Función que obtiene la lista de actividades
  const getActividadAll = async () => {
    const resp = await actividadRepository.getAll();
    if (resp.success) {
      setActividad(resp.data.results);
    }
  };

  // Función que obtiene las actividades realizadas de una clase (array plano — RA-13)
  const getActividadesRealizadas = async (idclasetaller) => {
    const resp = await actividadRealizadaRepository.getActividadesRealizadasByClase(idclasetaller);
    if (resp.success) {
      setActividadRealizada(resp.data);
    }
  };

  /** manejador de estados de los checkboxes de actividades */
  const handleActividadCheck = (idactividad) => {
    setActividad((prevActividades) =>
      prevActividades.map((act) =>
        act.idactividad === idactividad ? { ...act, checked: !act.checked } : act
      )
    );
  };

  // Guardar o eliminar las actividades realizadas del encuentro según su estado
  const guardarActividadesSeleccionadas = async () => {
    const actividadesSeleccionadas = actividad.filter((act) => act.checked);

    const actividadesToSave = actividadesSeleccionadas
      .filter(
        (seleccionada) =>
          !actividadRealizada.some(
            (realizada) => realizada.idactividad === seleccionada.idactividad
          )
      )
      .map((actividadItem) => ({
        idactividad: actividadItem.idactividad,
        idclasetaller: encuentroSeleccionado.idclasetaller,
      }));

    const actividadesADeseleccionar = actividadRealizada.filter(
      (realizada) =>
        !actividadesSeleccionadas.some(
          (seleccionada) => seleccionada.idactividad === realizada.idactividad
        )
    );
    const idsActividadesADeseleccionar = actividadesADeseleccionar.map(
      (realizada) => realizada.idactividadrealizada
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
      getActividadesRealizadas(encuentroSeleccionado.idclasetaller);
    }
  };

  const guardarNuevo = async (data) => {
    const resp = await encuentroRepository.createEncuentro({
      fecha: data.fecha,
      virtual: data.virtual ? 1 : 0,
      idtaller: data.idtaller,
    });
    if (resp.success) {
      showToast('success', 'Se ha guardado con éxito');
      setModalInsert(false);
      formInsert.reset();
      getEncuentroAll();
    }
  };

  // Edita un encuentro
  const guardarEdicion = async (data) => {
    const resp = await encuentroRepository.updateEncuentro(encuentroEditando.idclasetaller, {
      fecha: data.fecha,
      virtual: data.virtual ? 1 : 0,
      idtaller: data.idtaller,
    });
    if (resp.success) {
      showToast('success', 'Se ha guardado con éxito');
      setModalEdit(false);
      formEdit.reset();
      setEncuentroEditando(null);
      getEncuentroAll();
    }
  };

  const showModalInsert = () => {
    formInsert.reset({ fecha: '', virtual: true, idtaller: '' });
    setModalInsert(true);
  };

  const handleModalInsert = () => {
    formInsert.reset();
    setModalInsert(false);
  };

  // Al editar un encuentro muestra sus valores
  const showModalEdit = (data) => {
    setEncuentroEditando(data);
    formEdit.reset({
      fecha: data.fecha,
      virtual: data.virtual === 1,
      idtaller: data.idtaller,
    });
    setModalEdit(true);
  };

  const handleModalEdit = () => {
    formEdit.reset();
    setEncuentroEditando(null);
    setModalEdit(false);
  };

  // Función que obtiene para eliminar un encuentro
  const eliminarEncuentro = async (data) => {
    const ok = await showConfirm(
      `¿Seguro que desea eliminar el encuentro con fecha: ${utils.convertirFormatoFecha(data.fecha)}?`,
      `Código: ${data.idclasetaller}`
    );
    if (!ok) return;
    const resp = await encuentroRepository.deleteEncuentro(data.idclasetaller);
    if (resp.success) {
      showToast('success', 'Eliminado con éxito');
      setEncuentro(encuentro.filter((item) => item.idclasetaller !== data.idclasetaller));
    }
  };

  // Al cargar las actividades del encuentro, marca las previamente guardadas
  const showModalInsertAct = async (data) => {
    setEncuentroSeleccionado(data);
    setModalInsertAct(true);

    const resp = await actividadRealizadaRepository.getActividadesRealizadasByClase(
      data.idclasetaller
    );
    if (resp.success) {
      setActividadRealizada(resp.data);
      const actividadesConEstado = actividad.map((act) => ({
        ...act,
        checked: resp.data.some((realizada) => realizada.idactividad === act.idactividad),
      }));
      setActividad(actividadesConEstado);
    }
  };

  const handleModalInsertAct = () => {
    setActividadRealizada([]);
    setModalInsertAct(false);
  };

  // Agrupa las actividades por taller; el nombre del taller será la clave
  const actividadesPorTaller = actividad.reduce((acc, actividadItem) => {
    const tallerObj = taller.find((tallerItem) => tallerItem.idtaller === actividadItem.idtaller);
    const tallerNombre = tallerObj?.tipotaller || 'Taller sin nombre';

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
        <button
          type="button"
          className="btn btn-primary mb-2 mt-2"
          onClick={() => showModalInsert()}
        >
          <PlusIcon />
          Agregar
        </button>
        <br />
        <div className="row m-md-3 shadow mx-md-auto border-top-sm m-0">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Fecha</th>
                <th scope="col">Virtual</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {encuentro.map((element) => (
                <tr key={element.idclasetaller}>
                  <td>{element.idclasetaller}</td>
                  <td>{utils.convertirFormatoFecha(element.fecha)}</td>
                  <td>{element.virtual === 1 ? 'Sí' : ''}</td>
                  <td>
                    <button
                      type="button"
                      className={`btn ${styles.editButton}`}
                      title="Editar"
                      onClick={() => showModalEdit(element)}
                    >
                      <PencilIcon />
                    </button>

                    <button
                      type="button"
                      className={`btn ${styles.deleteButton}`}
                      title="Borrar"
                      onClick={() => eliminarEncuentro(element)}
                    >
                      <TrashIcon />
                    </button>

                    <button
                      type="button"
                      className={`btn ${styles.manageButton}`}
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
      </Container>

      {/* nuevo encuentro */}
      <Modal isOpen={modalInsert}>
        <ModalHeader>
          <div>
            <h2>Nuevo Encuentro</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <div className="form-group mb-2">
                  <label className="control-label">Fecha del encuentro</label>
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
              </FormGroup>
            </div>

            <div className="col-md-6">
              <FormGroup>
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
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <FormGroup>
                <div className="form-group mb-2">
                  <label className="control-label">Taller</label>
                  <select
                    className="form-select"
                    {...formInsert.register('idtaller', {
                      required: 'Debe seleccionar un taller.',
                    })}
                  >
                    <option value="">Elija el taller</option>
                    {taller.map((element) => (
                      <option key={element.idtaller} value={element.idtaller}>
                        {element.tipotaller}
                      </option>
                    ))}
                  </select>
                  {formInsert.formState.errors.idtaller && (
                    <small className="text-danger">
                      {formInsert.formState.errors.idtaller.message}
                    </small>
                  )}
                </div>
              </FormGroup>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-rojo" onClick={() => handleModalInsert()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde"
            onClick={() => formInsert.handleSubmit(guardarNuevo)()}
          >
            Guardar
          </button>
        </ModalFooter>
      </Modal>

      {/* editar encuentro */}
      <Modal isOpen={modalEdit}>
        <ModalHeader>
          <div>
            <h2>Editar encuentro</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <FormGroup>
                <label htmlFor="idclasetaller" className="control-label">
                  Código:
                </label>
                <input
                  type="text"
                  name="idclasetaller"
                  id="idclasetaller"
                  className="form-control"
                  readOnly
                  value={encuentroEditando ? encuentroEditando.idclasetaller : ''}
                />
              </FormGroup>
            </div>

            <div className="col-md-6">
              <FormGroup>
                <label className="control-label">Fecha de encuentro</label>
                <input
                  type="date"
                  className="form-control"
                  {...formEdit.register('fecha', { required: 'La fecha no puede estar vacío.' })}
                />
                {formEdit.formState.errors.fecha && (
                  <small className="text-danger">{formEdit.formState.errors.fecha.message}</small>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6">
              <FormGroup>
                <div className="form-check">
                  <label htmlFor="virtual" className="form-check-label">
                    Virtual
                  </label>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="virtual"
                    {...formEdit.register('virtual')}
                  />
                </div>
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <FormGroup>
                <div className="form-group mb-2">
                  <label className="control-label">Taller</label>
                  <select
                    className="form-select"
                    {...formEdit.register('idtaller', {
                      required: 'Debe seleccionar un taller.',
                    })}
                  >
                    <option value="">Elija el taller</option>
                    {taller.map((element) => (
                      <option key={element.idtaller} value={element.idtaller}>
                        {element.tipotaller}
                      </option>
                    ))}
                  </select>
                  {formEdit.formState.errors.idtaller && (
                    <small className="text-danger">
                      {formEdit.formState.errors.idtaller.message}
                    </small>
                  )}
                </div>
              </FormGroup>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-rojo" onClick={() => handleModalEdit()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde"
            onClick={() => formEdit.handleSubmit(guardarEdicion)()}
          >
            Guardar
          </button>
        </ModalFooter>
      </Modal>

      {/* elegir actividades */}
      <Modal isOpen={modalInsertAct}>
        <ModalHeader>
          <div>
            <h3>Actividades del encuentro:</h3>
            <label className="control-label">
              <div>
                {encuentroSeleccionado
                  ? utils.convertirFormatoFecha(encuentroSeleccionado.fecha)
                  : ''}
              </div>
              <h6>Código: {encuentroSeleccionado ? encuentroSeleccionado.idclasetaller : ''}</h6>
            </label>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className={`col-12 col-md-12 col-lg-12 col-xl-12 ${styles.scrollContainer}`}>
              <table className="table table-bordered table-hover shadow table-striped">
                <tbody>
                  {nombresTalleres.map((tallerNombre) => (
                    <React.Fragment key={tallerNombre}>
                      <tr>
                        <td colSpan="1" className={styles.groupHeader}>
                          {tallerNombre}
                        </td>
                      </tr>

                      {actividadesPorTaller[tallerNombre].map((act) => (
                        <tr key={act.idactividad}>
                          <td>{act.nombre}</td>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`actividad-${act.idactividad}`}
                              value={act.idactividad}
                              checked={act.checked || false}
                              onChange={() => handleActividadCheck(act.idactividad)}
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
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-rojo" onClick={() => handleModalInsertAct()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde"
            onClick={() => guardarActividadesSeleccionadas()}
          >
            Guardar
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Encuentro;
