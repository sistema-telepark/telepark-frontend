import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector, useDispatch } from 'react-redux';
import { evolucionRepository } from '../services/evolucionService';
import utils from '../utils/utils';

const ListaEvolucion = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);
  const dispatch = useDispatch();

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
    if ((escala !== '') & (fechaEvolucion !== '')) {
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
        .catch((e) => {
          console.log(e);
        });
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
    console.log(campo);
  };

  const agregar = () => {
    setShowNuevo(true);
    setShow(false);
    setCampo({ nroEvolucion: '', fecha: '' });
  };

  const cargarNuevo = () => {
    let escala = campo.nroEvolucion;
    let fechaEvolucion = campo.fecha;
    if ((escala !== '') & (fechaEvolucion !== '')) {
      let data = {
        escalaevolucion: escala,
        fecha: fechaEvolucion,
        idpersonaep: idEpElegido,
        borrado: '0',
      };
      evolucionRepository
        .create(data)
        .then((dataevolucion) => {
          getEvoluciones();
          notificacionGuardar();
        })
        .catch((e) => {
          console.log(e);
        });
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
      .catch((e) => {
        console.log(e);
      });
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
      className="border-top-sm m-0 row justify-content-center form-paciente m-md-3 rounded shadow container-lg mx-md-auto"
      style={{ paddingTop: 20 }}
    >
      <div className="mb-4 col-12 col-md-9 col-lg-12 col-xl-10">
        <h3 className="mt-4">Evolución de Persona con EP</h3>
        <hr />
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6 col-xl-6">
            <h5>
              <b>Nombre y Apellido:</b> {nombreEpElegido}
            </h5>
          </div>
          <div className="mb-4 col-12 col-md-6 col-lg-6 col-xl-6" style={{ textAlign: 'right' }}>
            <button type="button" className="btn btn-azul" onClick={() => agregar()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-lg"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
              </svg>
              Agregar
            </button>
          </div>
        </div>

        <span>
          {showNuevo ? (
            <div className="border-top-sm m-0 row form-paciente m-md-3 rounded shadow container-lg mx-md-auto">
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
              <div
                className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4"
                style={{ textAlign: 'center', paddingTop: 38 }}
              >
                <button
                  type="submit"
                  className="btn btn-verde"
                  style={{ width: '40%' }}
                  onClick={() => cargarNuevo()}
                >
                  Confirmar
                </button>
                <button
                  type="submit"
                  className="btn btn-rojo"
                  style={{ width: '40%', marginLeft: 10 }}
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
            <div className="border-top-sm m-0 row justify-content-center form-paciente m-md-3 rounded shadow container-lg mx-md-auto">
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
              <div
                className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4"
                style={{ textAlign: 'center', paddingTop: 38 }}
              >
                <button
                  type="submit"
                  className="btn btn-verde"
                  style={{ width: '40%' }}
                  onClick={() => guardar()}
                >
                  Guardar
                </button>
                <button
                  type="submit"
                  className="btn btn-rojo"
                  style={{ width: '40%', marginLeft: 10 }}
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
              className="table table-bordered table-hover shadow table-striped"
              style={{ width: '100%' }}
            >
              <thead>
                <tr>
                  <th scope="col">Estado Evolutivo</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Fecha de Observación</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody style={{ verticalAlign: 'middle' }}>
                {evoluciones &&
                  evoluciones
                    .filter((evolucion) => evolucion.borrado === 0)
                    .map((evolucion, index) => (
                      <tr key={index}>
                        <td>Estado: {evolucion.escalaevolucion}</td>
                        <td>{utils.describirEstado(evolucion.escalaevolucion)}</td>
                        <td>{utils.convertirFormatoFecha(evolucion.fecha)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-verde"
                            style={{ marginRight: 10 }}
                            onClick={() =>
                              editar(
                                evolucion.escalaevolucion,
                                evolucion.fecha,
                                evolucion.idevolucion
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                              <path
                                fillRule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                              />
                            </svg>
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

export default ListaEvolucion;
