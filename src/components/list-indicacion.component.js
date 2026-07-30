import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector, useDispatch } from 'react-redux';
import { indicacionRepository } from '../services/indicacionService';
import { medicamentoRepository } from '../services/medicamentoService';
import utils from '../utils/utils';

const ListaIndicacion = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [campo, setCampo] = useState({
    medicamento: '',
    dosis: '',
    hora: '',
    fecha: '',
    estado: '',
  });
  const [idEditado, setIdEditado] = useState('');
  const [indicaciones, setIndicaciones] = useState();
  const [medicamentos, setMedicamentos] = useState();

  useEffect(() => {
    getIndicaciones();
    getMedicamento();
  }, []);

  // Funcion que obtiene la lista de indicaciones de un paciente
  const getIndicaciones = async () => {
    let response = await indicacionRepository.get(idEpElegido);

    if (response) {
      setIndicaciones(response.data);
    }
  };

  // Funcion que obtiene la lista de medicamentos
  const getMedicamento = async () => {
    let response = await medicamentoRepository.getAll();

    if (response) {
      setMedicamentos(response.data);
    }
  };

  const editar = (dosis, estado, fecha, hora, medicamento, idindicacion) => {
    setShow(true);
    setShowNuevo(false);
    setIdEditado(idindicacion);
    setCampo({ medicamento: medicamento, dosis: dosis, hora: hora, fecha: fecha, estado: estado });
  };

  const guardar = () => {
    let idMedicamento = campo.medicamento;
    let dosisMedicamento = campo.dosis;
    let horaMedicamento = campo.hora;
    let fechaMedicamento = campo.fecha;
    let estadoMedicamento = campo.estado;
    let id = idEditado;
    if (
      (idMedicamento !== '') &
      (dosisMedicamento !== '') &
      (horaMedicamento !== '') &
      (fechaMedicamento !== '') &
      (estadoMedicamento !== '')
    ) {
      let data = {
        cantidadmiligramos: dosisMedicamento,
        estavigente: estadoMedicamento,
        fechaprescripcion: fechaMedicamento,
        horadetoma: horaMedicamento,
        idpersonaep: idEpElegido,
        idmedicamento: idMedicamento,
        borrado: '0',
      };
      indicacionRepository
        .update(id, data)
        .then(() => {
          getIndicaciones();
          notificacionGuardar();
        })
        .catch((e) => {
          console.log(e);
        });
      setCampo({ medicamento: '', dosis: '', hora: '', fecha: '', estado: '' });
      setShow(false);
    }
  };

  const cancelar = () => {
    setShow(false);
    setShowNuevo(false);
    setCampo({ medicamento: '', dosis: '', hora: '', fecha: '', estado: '' });
  };

  const detectarCambio = (field, e) => {
    setCampo({ ...campo, [field]: e.target.value });
    console.log(campo);
  };

  const agregar = () => {
    setShowNuevo(true);
    setShow(false);
    setCampo({ medicamento: '', dosis: '', hora: '', fecha: '', estado: '' });
  };

  const cargarNuevo = () => {
    let idMedicamento = campo.medicamento;
    let dosisMedicamento = campo.dosis;
    let horaMedicamento = campo.hora;
    let fechaMedicamento = campo.fecha;
    let estadoMedicamento = campo.estado;
    if (
      (idMedicamento !== '') &
      (dosisMedicamento !== '') &
      (horaMedicamento !== '') &
      (fechaMedicamento !== '') &
      (estadoMedicamento !== '')
    ) {
      let data = {
        cantidadmiligramos: dosisMedicamento,
        estavigente: estadoMedicamento,
        fechaprescripcion: fechaMedicamento,
        horadetoma: horaMedicamento,
        idpersonaep: idEpElegido,
        idmedicamento: idMedicamento,
        borrado: '0',
      };
      indicacionRepository
        .create(data)
        .then((dataindicacion) => {
          getIndicaciones();
          notificacionGuardar();
        })
        .catch((e) => {
          console.log(e);
        });
      setCampo({ medicamento: '', dosis: '', hora: '', fecha: '', estado: '' });
      setShowNuevo(false);
    }
  };

  const eliminar = (cantidadmiligramos, estavigente, fechaprescripcion, horadetoma, idmedicamento, id) => {
    var data = {
      cantidadmiligramos: cantidadmiligramos,
      estavigente: estavigente,
      fechaprescripcion: fechaprescripcion,
      horadetoma: horadetoma,
      idpersonaep: idEpElegido,
      idmedicamento: idmedicamento,
      borrado: '1',
    };
    indicacionRepository
      .update(id, data)
      .then(() => {
        getIndicaciones();
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

  const notificacionEliminar = (
    cantidadmiligramos,
    estavigente,
    fechaprescripcion,
    horadetoma,
    idmedicamento,
    idIndicacion
  ) => {
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
          eliminar(
            cantidadmiligramos,
            estavigente,
            fechaprescripcion,
            horadetoma,
            idmedicamento,
            idIndicacion
          );
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
        <h3 className="mt-4">Indicación de Medicamentos</h3>
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
              <h4 className="mt-4">Nueva Indicación Médica</h4>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Nombre de Medicamento</label>
                <select
                  className="form-select"
                  placeholder="Ingrese medicamento..."
                  id="medicamento"
                  onChange={(e) => detectarCambio('medicamento', e)}
                  value={campo['medicamento'] || ''}
                >
                  <option value="">Elegir</option>
                  {medicamentos &&
                    medicamentos.map((medicamento, index) => (
                      <option value={medicamento.idmedicamento} key={index}>
                        {medicamento.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Dosis</label>
                <input
                  type="number"
                  className="form-control"
                  id="dosis"
                  onChange={(e) => detectarCambio('dosis', e)}
                />
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Hora de Toma</label>
                <input
                  type="time"
                  className="form-control"
                  id="hora"
                  onChange={(e) => detectarCambio('hora', e)}
                />
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Prescripción</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  onChange={(e) => detectarCambio('fecha', e)}
                />
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Estado</label>
                <select
                  className="form-select"
                  placeholder="Ingrese estado..."
                  id="estado"
                  onChange={(e) => detectarCambio('estado', e)}
                  value={campo['estado'] || ''}
                >
                  <option value="">Elegir</option>
                  <option value="1">Vigente</option>
                  <option value="0">Caducado</option>
                </select>
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
                <label className="col-form-label">Nombre de Medicamento</label>
                <select
                  className="form-select"
                  placeholder="Ingrese medicamento..."
                  id="medicamento"
                  onChange={(e) => detectarCambio('medicamento', e)}
                  value={campo['medicamento'] || ''}
                >
                  <option value="">Elegir</option>
                  {medicamentos &&
                    medicamentos.map((medicamento, index) => (
                      <option value={medicamento.idmedicamento} key={index}>
                        {medicamento.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Dosis</label>
                <input
                  type="number"
                  className="form-control"
                  id="dosis"
                  onChange={(e) => detectarCambio('dosis', e)}
                  value={campo['dosis'] || ''}
                />
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Hora de Toma</label>
                <input
                  type="time"
                  className="form-control"
                  id="hora"
                  onChange={(e) => detectarCambio('hora', e)}
                  value={campo['hora'] || ''}
                />
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Fecha de Prescripción</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  onChange={(e) => detectarCambio('fecha', e)}
                  value={campo['fecha'] || ''}
                />
              </div>
              <div className="mb-4 col-12 col-md-6 col-lg-4 col-xl-4">
                <label className="col-form-label">Estado</label>
                <select
                  className="form-select"
                  placeholder="Ingrese estado..."
                  id="estado"
                  onChange={(e) => detectarCambio('estado', e)}
                  value={campo['estado']}
                >
                  <option value="">Elegir</option>
                  <option value="1">Vigente</option>
                  <option value="0">Caducado</option>
                </select>
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
                  <th scope="col">Nombre de Medicamento</th>
                  <th scope="col">Dosis en mg</th>
                  <th scope="col">Hora de Toma</th>
                  <th scope="col">Fecha de Prescripción</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody style={{ verticalAlign: 'middle' }}>
                {indicaciones &&
                  indicaciones
                    .filter((indicacion) => indicacion.borrado === 0)
                    .map((indicacion, index) => (
                      <tr key={index}>
                        <td>{indicacion.idmedicamento.nombre}</td>
                        <td>{indicacion.cantidadmiligramos} mg</td>
                        <td>Cada {utils.convertirFormatoHora(indicacion.horadetoma)} hs</td>
                        <td>{utils.convertirFormatoFecha(indicacion.fechaprescripcion)}</td>
                        <td>{utils.convertirEstado(indicacion.estavigente)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-verde"
                            style={{ marginRight: 10 }}
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
                                indicacion.cantidadmiligramos,
                                indicacion.estavigente,
                                indicacion.fechaprescripcion,
                                indicacion.horadetoma,
                                indicacion.idmedicamento.idmedicamento,
                                indicacion.idindicacion
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

export default ListaIndicacion;
