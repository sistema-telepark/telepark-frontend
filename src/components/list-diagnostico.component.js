import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector, useDispatch } from 'react-redux';
import { diagnosticoRepository } from '../services/diagnosticoService';
import { enfermedadRepository } from '../services/enfermedadService';
import utils from '../utils/utils';

const ListaDiagnostico = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [campo, setCampo] = useState({
    enfermedad: '',
    fecha: '',
  });
  const [idEditado, setIdEditado] = useState('');
  const [enfermedades, setEnfermedades] = useState();
  const [diagnosticos, setDiagnosticos] = useState();

  useEffect(() => {
    getEnfermedad();
    getDiagnosticos();
  }, []);

  // Funcion que obtiene la lista de enfermedades
  const getEnfermedad = async () => {
    let response = await enfermedadRepository.getAll();

    if (response) {
      setEnfermedades(response.data);
    }
  };

  // Funcion que obtiene la lista de diagnosticos de un paciente
  const getDiagnosticos = async () => {
    let response = await diagnosticoRepository.get(idEpElegido);

    if (response) {
      setDiagnosticos(response.data);
    }
  };

  const editar = (enfermedad, fecha, iddiagnostico) => {
    setShow(true);
    setShowNuevo(false);
    setIdEditado(iddiagnostico);
    setCampo({ enfermedad: enfermedad, fecha: fecha });
  };

  const guardar = () => {
    let idEnfermedad = campo.enfermedad;
    let fechaEnfermedad = campo.fecha;
    let id = idEditado;
    if ((idEnfermedad !== '') & (fechaEnfermedad !== '')) {
      var data = {
        fecha: fechaEnfermedad,
        idpersonaep: idEpElegido,
        idenfermedad: idEnfermedad,
        borrado: '0',
      };
      diagnosticoRepository
        .update(id, data)
        .then((response) => {
          if (response) {
            getDiagnosticos();
            notificacionGuardar();
          }
        })
        .catch((e) => {
          console.log(e);
        });
      setCampo({ enfermedad: '', fecha: '' });
      setShow(false);
    }
  };

  const cancelar = () => {
    setShow(false);
    setShowNuevo(false);
    setCampo({ enfermedad: '', fecha: '' });
  };

  const detectarCambio = (field, e) => {
    setCampo({ ...campo, [field]: e.target.value });
    console.log(campo);
  };

  const agregar = () => {
    setShowNuevo(true);
    setShow(false);
    setCampo({ enfermedad: '', fecha: '' });
  };

  const cargarNuevo = () => {
    let idEnfermedad = campo.enfermedad;
    let fechaEnfermedad = campo.fecha;
    if ((idEnfermedad !== '') & (fechaEnfermedad !== '')) {
      let data = {
        fecha: fechaEnfermedad,
        idpersonaep: idEpElegido,
        idenfermedad: idEnfermedad,
        borrado: '0',
      };
      diagnosticoRepository
        .create(data)
        .then((reponse) => {
          if (reponse) {
            getDiagnosticos();
            notificacionGuardar();
          }
        })
        .catch((e) => {
          console.log(e);
        });
      setCampo({ enfermedad: '', fecha: '' });
      setShowNuevo(false);
    }
  };

  const eliminar = (idenfermedad, fecha, id) => {
    var data = {
      fecha: fecha,
      idpersonaep: idEpElegido,
      idenfermedad: idenfermedad,
      borrado: '1',
    };
    diagnosticoRepository
      .update(id, data)
      .then((response) => {
        if (response) {
          getDiagnosticos();
        }
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

  const notificacionEliminar = (idenfermedad, fecha, idDiagnostico) => {
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
          eliminar(idenfermedad, fecha, idDiagnostico);
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
        <h3 className="mt-4">Diagnóstico de Enfermadades</h3>
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
              <h4 className="mt-4">Nuevo Diagnóstico</h4>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Nombre de Enfermedad</label>
                <select
                  className="form-select"
                  placeholder="Ingrese enfermedad..."
                  id="enfermedad"
                  onChange={(e) => detectarCambio('enfermedad', e)}
                  value={campo['enfermedad'] || ''}
                >
                  <option value="">Elegir</option>
                  {enfermedades &&
                    enfermedades.map((enfermedad, index) => (
                      <option value={enfermedad.idenfermedad} key={index}>
                        {enfermedad.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Diagnóstico</label>
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
                <label className="col-form-label">Nombre de Enfermedad</label>
                <select
                  className="form-select"
                  placeholder="Ingrese enfermedad..."
                  id="enfermedad"
                  onChange={(e) => detectarCambio('enfermedad', e)}
                  value={campo['enfermedad'] || ''}
                >
                  <option value="">Elegir</option>
                  {enfermedades &&
                    enfermedades.map((enfermedad, index) => (
                      <option value={enfermedad.idenfermedad} key={index}>
                        {enfermedad.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Diagnóstico</label>
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
                  <th scope="col">Nombre de Enfermedad</th>
                  <th scope="col">Fecha de Diagnóstico</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody style={{ verticalAlign: 'middle' }}>
                {diagnosticos &&
                  diagnosticos
                    .filter((diagnostico) => diagnostico.borrado === 0)
                    .map((diagnostico, index) => (
                      <tr key={index}>
                        <td>{diagnostico.idenfermedad.nombre}</td>
                        <td>{utils.convertirFormatoFecha(diagnostico.fecha)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-verde"
                            style={{ marginRight: 10 }}
                            onClick={() =>
                              editar(
                                diagnostico.idenfermedad.idenfermedad,
                                diagnostico.fecha,
                                diagnostico.iddiagnostico
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
                                diagnostico.idenfermedad.idenfermedad,
                                diagnostico.fecha,
                                diagnostico.iddiagnostico
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

export default ListaDiagnostico;
