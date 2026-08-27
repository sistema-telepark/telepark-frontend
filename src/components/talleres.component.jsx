import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Form, Modal } from 'react-bootstrap';
import { tallerRepository } from '../services/taller.service';
import { actividadRepository } from '../services/actividad.service';
import { showToast, showConfirm } from '../services/notification.service';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import styles from '../styles/talleres.module.css';

const TIPOS_TALLER = ['Educación física', 'Literario', 'Danza'];

let contadorIdLocal = 1;
const generarIdLocal = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `local-${contadorIdLocal++}`;
};

const Talleres = () => {
  const [taller, setTaller] = useState([]);
  const [act, setAct] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const [tallerEditando, setTallerEditando] = useState(null);

  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalInsertAct, setModalInsertAct] = useState(false);

  const formInsert = useForm();
  const formEdit = useForm();
  const formAct = useForm();

  useEffect(() => {
    getTallerAll();
    getActividades();
  }, []);

  // Función que obtiene la lista de talleres
  const getTallerAll = async () => {
    const resp = await tallerRepository.getTallerAll();
    if (resp.success) {
      setTaller(resp.data.results);
    }
  };

  // Función que obtiene la lista de actividades
  const getActividades = async () => {
    const resp = await actividadRepository.getAll();
    if (resp.success) {
      setAct(resp.data.results);
    }
  };

  const showModalInsert = () => {
    formInsert.reset({ tipotaller: '' });
    setModalInsert(true);
  };

  const handleModalInsert = () => {
    formInsert.reset();
    setModalInsert(false);
  };

  const showModalEdit = (data) => {
    setTallerEditando(data);
    formEdit.reset({ tipotaller: data.tipotaller });
    setModalEdit(true);
  };

  const handleModalEdit = () => {
    formEdit.reset();
    setTallerEditando(null);
    setModalEdit(false);
  };

  const showModalInsertAct = (data) => {
    setTallerSeleccionado(data);
    formAct.reset({ nombre: '' });
    setActividades([]);
    setModalInsertAct(true);
  };

  const handleModalInsertAct = () => {
    formAct.reset();
    setActividades([]);
    setModalInsertAct(false);
  };

  // Guardar datos de un nuevo taller
  const guardarNuevo = async (data) => {
    const resp = await tallerRepository.createTaller({ tipotaller: data.tipotaller });
    if (resp.success) {
      showToast('success', 'Se ha guardado con éxito');
      setModalInsert(false);
      formInsert.reset();
      getTallerAll();
    }
  };

  // Editar un taller existente
  const editar = async (data) => {
    const resp = await tallerRepository.updateTaller(tallerEditando.idtaller, {
      tipotaller: data.tipotaller,
    });
    if (resp.success) {
      showToast('success', 'Se ha guardado con éxito');
      setModalEdit(false);
      formEdit.reset();
      setTallerEditando(null);
      getTallerAll();
    }
  };

  // Borrar un taller con confirmación y DELETE real
  const deleteT = async (data) => {
    const ok = await showConfirm(`¿Seguro que desea eliminar el taller: ${data.tipotaller}?`);
    if (!ok) return;
    const resp = await tallerRepository.deleteTaller(data.idtaller);
    if (resp.success) {
      showToast('success', 'Eliminado con éxito');
      setTaller(taller.filter((item) => item.idtaller !== data.idtaller));
    }
  };

  // Agregar una actividad pendiente al lote local del taller
  const cargarNuevo = (data) => {
    const nuevaActividad = { nombre: data.nombre, idLocal: generarIdLocal() };
    setActividades([...actividades, nuevaActividad]);
    formAct.reset();
  };

  // Eliminar una actividad pendiente (solo estado local, sin backend)
  const eliminar = (idLocal) => {
    setActividades(actividades.filter((actividad) => actividad.idLocal !== idLocal));
  };

  // Borrar una actividad persistida con confirmación y DELETE real
  const deleteA = async (data) => {
    const ok = await showConfirm(`¿Seguro que desea eliminar la actividad: ${data.nombre}?`);
    if (!ok) return;
    const resp = await actividadRepository.delete(data.idactividad);
    if (resp.success) {
      showToast('success', 'Eliminado con éxito');
      getActividades();
    }
  };

  // Guardar el lote de actividades pendientes del taller
  const guardarAct = async () => {
    const results = await Promise.all(
      actividades.map((actividad) =>
        actividadRepository.create({
          nombre: actividad.nombre,
          idtaller: tallerSeleccionado.idtaller,
        })
      )
    );
    if (results.every((resp) => resp.success)) {
      showToast('success', 'Se ha guardado con éxito');
      setModalInsertAct(false);
      formAct.reset();
      setActividades([]);
      getActividades();
    }
  };

  const actividadesPersistidas = tallerSeleccionado
    ? act.filter((actividad) => actividad.idtaller === tallerSeleccionado.idtaller).reverse()
    : [];

  return (
    <>
      <Container className="container panel-gris">
        <h2 className="mt-4 text-center">Talleres</h2>
        <hr />
        <button
          type="button"
          className="btn btn-azul mb-2 mt-2"
          onClick={() => showModalInsert()}
        >
          <PlusIcon />
          Agregar
        </button>
        <div className="row m-md-3 shadow mx-md-auto border-top-sm m-0">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {taller.map((element) => (
                <tr key={element.idtaller}>
                  <td>{element.idtaller}</td>
                  <td>{element.tipotaller}</td>
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
                      onClick={() => deleteT(element)}
                    >
                      <TrashIcon />
                    </button>

                    <button
                      type="button"
                      className={`btn ${styles.manageButton}`}
                      title="Gestionar actividades"
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

      {/* nuevo taller */}
      <Modal show={modalInsert}>
        <Modal.Header>
          <div>
            <h2>Ingresar nuevo taller</h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <Form.Group className="mb-0">
                <div className="form-group mb-2">
                  <label htmlFor="tipotaller" className="control-label">
                    Tipo de taller
                  </label>
                  <select
                    className="form-select"
                    placeholder="Ingrese el tipo de taller"
                    {...formInsert.register('tipotaller', {
                      required: 'Debe seleccionar un tipo de taller.',
                    })}
                  >
                    <option value="">Elija el tipo de taller</option>
                    {TIPOS_TALLER.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                  {formInsert.formState.errors.tipotaller && (
                    <small className="text-danger">
                      {formInsert.formState.errors.tipotaller.message}
                    </small>
                  )}
                </div>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>

      {/* editar taller */}
      <Modal show={modalEdit}>
        <Modal.Header>
          <div>
            <h2>Editar taller</h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Form.Group className="mb-0">
              <label htmlFor="idtaller" className="control-label">
                Código:
              </label>
              <input
                type="text"
                name="idtaller"
                id="idtaller"
                className="form-control"
                readOnly
                value={tallerEditando ? tallerEditando.idtaller : ''}
              />
            </Form.Group>

            <div className="col-md-12">
              <Form.Group className="mb-0">
                <div className="form-group mb-2">
                  <label htmlFor="tipotaller" className="control-label">
                    Tipo de taller
                  </label>
                  <select
                    className="form-select"
                    placeholder="Ingrese el tipo de taller"
                    {...formEdit.register('tipotaller', {
                      required: 'Debe seleccionar un tipo de taller.',
                    })}
                  >
                    <option value="">Seleccione el tipo de taller</option>
                    {TIPOS_TALLER.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                  {formEdit.formState.errors.tipotaller && (
                    <small className="text-danger">
                      {formEdit.formState.errors.tipotaller.message}
                    </small>
                  )}
                </div>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-rojo" onClick={() => handleModalEdit()}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-verde"
            onClick={() => formEdit.handleSubmit(editar)()}
          >
            Guardar
          </button>
        </Modal.Footer>
      </Modal>

      {/* guardar actividades */}
      <Modal show={modalInsertAct}>
        <Modal.Header>
          <div>
            <h3>Actividades del taller:</h3>
            <label className="control-label">
              {tallerSeleccionado ? tallerSeleccionado.tipotaller : ''}{' '}
              <h6>Código: {tallerSeleccionado ? tallerSeleccionado.idtaller : ''} </h6>
            </label>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Form.Group className="mb-0">
              <label className="control-label">Ingrese nueva actividad:</label>
              <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12 input-group">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de la actividad"
                    {...formAct.register('nombre', {
                      required: 'El nombre de la actividad no puede estar vacío.',
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-azul"
                    onClick={() => formAct.handleSubmit(cargarNuevo)()}
                  >
                    <PlusIcon />
                  </button>
                </div>
                {formAct.formState.errors.nombre && (
                  <small className="text-danger">{formAct.formState.errors.nombre.message}</small>
                )}
              </div>
            </Form.Group>

            <div className={`col-12 col-md-12 col-lg-12 col-xl-12 ${styles.scrollContainer}`}>
              <table className="table table-bordered table-hover shadow table-striped">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {actividades.map((actividad) => (
                    <tr key={actividad.idLocal}>
                      <td>{actividad.nombre}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-rojo"
                          onClick={() => eliminar(actividad.idLocal)}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {actividadesPersistidas.map((actividad) => (
                    <tr key={actividad.idactividad}>
                      <td>{actividad.nombre}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-rojo"
                          onClick={() => deleteA(actividad)}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-rojo" onClick={() => handleModalInsertAct()}>
            Cancelar
          </button>
          <button type="button" className="btn btn-verde" onClick={() => guardarAct()}>
            Guardar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Talleres;
