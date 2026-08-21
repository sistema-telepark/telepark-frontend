import React, { memo, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { evolucionRepository } from '../services/evolucion.service';
import utils from '../utils/utils';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import styles from '../styles/list-evolucion.module.css';

const ListaEvolucion = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);

  const [show, setShow] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [campo, setCampo] = useState({
    nroEvolucion: '',
    fecha: '',
  });
  const [idEditado, setIdEditado] = useState('');
  const [evoluciones, setEvoluciones] = useState();

  useEffect(() => {
    getEvoluciones();
  }, []);

  // Funcion que obtiene la lista de evolucion de un paciente
  const getEvoluciones = async () => {
    let response = await evolucionRepository.get(idEpElegido);

    if (response) {
      setEvoluciones(response.data);
    }
  };

  const editar = (nroEvolucion, fecha, idevolucion) => {
    setShow(true);
    setShowNuevo(false);
    setIdEditado(idevolucion);
    setCampo({ nroEvolucion: nroEvolucion, fecha: fecha });
  };

  const guardar = () => {
    let escala = campo.nroEvolucion;
    let fechaEvolucion = campo.fecha;
    let id = idEditado;
    if (escala !== '' && fechaEvolucion !== '') {
      let data = {
        escalaevolucion: escala,
        fecha: fechaEvolucion,
        idpersonaep: idEpElegido,
        borrado: '0',
      };
      evolucionRepository
        .update(id, data)
        .then(() => {
          getEvoluciones();
          notificacionGuardar();
        })
        .catch(() => undefined);
      setCampo({ nroEvolucion: '', fecha: '' });
      setShow(false);
    }
  };

  const cancelar = () => {
    setShow(false);
    setShowNuevo(false);
    setCampo({ nroEvolucion: '', fecha: '' });
  };

  const detectarCambio = (field, e) => {
    setCampo({ ...campo, [field]: e.target.value });
  };

  const agregar = () => {
    setShowNuevo(true);
    setShow(false);
    setCampo({ nroEvolucion: '', fecha: '' });
  };

  const cargarNuevo = () => {
    let escala = campo.nroEvolucion;
    let fechaEvolucion = campo.fecha;
    if (escala !== '' && fechaEvolucion !== '') {
      let data = {
        escalaevolucion: escala,
        fecha: fechaEvolucion,
        idpersonaep: idEpElegido,
        borrado: '0',
      };
      evolucionRepository
        .create(data)
        .then(() => {
          getEvoluciones();
          notificacionGuardar();
        })
        .catch(() => undefined);
      setCampo({ nroEvolucion: '', fecha: '' });
      setShowNuevo(false);
    }
  };

  const eliminar = (escalaevolucion, fecha, id) => {
    var data = {
      escalaevolucion: escalaevolucion,
      fecha: fecha,
      idpersonaep: idEpElegido,
      borrado: '1',
    };
    evolucionRepository
      .update(id, data)
      .then(() => {
        getEvoluciones();
      })
      .catch(() => undefined);
    setShow(false);
  };

  //notificaciones
  const notificacionGuardar = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Se ha guardado con éxito',
    });
  };

  const notificacionEliminar = (escalaevolucion, fecha, idEvolucion) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success margenbutton',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Estas seguro?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si!',
        cancelButtonText: 'No',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          eliminar(escalaevolucion, fecha, idEvolucion);
          swalWithBootstrapButtons.fire('Eliminado!', 'Se ha eliminado el registro', 'success');
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire('Cancelado', 'No se eliminaron registros', 'error');
        }
      });
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

        <span>
          {showNuevo ? (
            <div className="border-top-sm m-0 row panel-gris m-md-3 rounded shadow container-lg mx-md-auto">
              <h4 className="mt-4">Nueva Observación</h4>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Estado Evolutivo</label>
                <select
                  className="form-select"
                  placeholder="Ingrese estado..."
                  id="nroEvolucion"
                  onChange={(e) => detectarCambio('nroEvolucion', e)}
                  value={campo['nroEvolucion'] || ''}
                >
                  <option value="">Elegir</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Observación</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  onChange={(e) => detectarCambio('fecha', e)}
                />
              </div>
              <div className={'mb-4 col-12 col-md-6 col-lg-4 col-xl-4 ' + styles.formActions}>
                <button
                  type="submit"
                  className={'btn btn-verde ' + styles.submitButton}
                  onClick={() => cargarNuevo()}
                >
                  Confirmar
                </button>
                <button
                  type="submit"
                  className={'btn btn-rojo ' + styles.cancelButton}
                  onClick={() => cancelar()}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
        </span>

        <span>
          {show ? (
            <div className="border-top-sm m-0 row justify-content-center panel-gris m-md-3 rounded shadow container-lg mx-md-auto">
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Estado Evolutivo</label>
                <select
                  className="form-select"
                  placeholder="Ingrese estado..."
                  id="nroEvolucion"
                  onChange={(e) => detectarCambio('nroEvolucion', e)}
                  value={campo['nroEvolucion'] || ''}
                >
                  <option value="">Elegir</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Observación</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  onChange={(e) => detectarCambio('fecha', e)}
                  value={campo['fecha'] || ''}
                />
              </div>
              <div className={'mb-4 col-12 col-md-6 col-lg-4 col-xl-4 ' + styles.formActions}>
                <button
                  type="submit"
                  className={'btn btn-verde ' + styles.submitButton}
                  onClick={() => guardar()}
                >
                  Guardar
                </button>
                <button
                  type="submit"
                  className={'btn btn-rojo ' + styles.cancelButton}
                  onClick={() => cancelar()}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
        </span>

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
                  <th scope="col">Descripción</th>
                  <th scope="col">Fecha de Observación</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {evoluciones &&
                  evoluciones
                    .filter((evolucion) => evolucion.borrado === 0)
                    .map((evolucion) => (
                      <tr key={evolucion.idevolucion}>
                        <td>Estado: {evolucion.escalaevolucion}</td>
                        <td>{utils.describirEstado(evolucion.escalaevolucion)}</td>
                        <td>{utils.convertirFormatoFecha(evolucion.fecha)}</td>
                        <td>
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(ListaEvolucion);
