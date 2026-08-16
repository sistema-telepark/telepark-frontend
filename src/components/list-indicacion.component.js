import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { indicacionRepository } from '../services/indicacion.service';
import { medicamentoRepository } from '../services/medicamento.service';
import utils from '../utils/utils';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import styles from '../styles/list-indicacion.module.css';

const ListaIndicacion = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);

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
      idMedicamento !== '' &&
      dosisMedicamento !== '' &&
      horaMedicamento !== '' &&
      fechaMedicamento !== '' &&
      estadoMedicamento !== ''
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
        .catch(() => undefined);
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
      idMedicamento !== '' &&
      dosisMedicamento !== '' &&
      horaMedicamento !== '' &&
      fechaMedicamento !== '' &&
      estadoMedicamento !== ''
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
        .then(() => {
          getIndicaciones();
          notificacionGuardar();
        })
        .catch(() => undefined);
      setCampo({ medicamento: '', dosis: '', hora: '', fecha: '', estado: '' });
      setShowNuevo(false);
    }
  };

  const eliminar = (
    cantidadmiligramos,
    estavigente,
    fechaprescripcion,
    horadetoma,
    idmedicamento,
    id
  ) => {
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
      className={
        'border-top-sm m-0 row justify-content-center form-paciente m-md-3 rounded shadow container-lg mx-md-auto ' +
        styles.pageHeader
      }
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
          <div className={'mb-4 col-12 col-md-6 col-lg-6 col-xl-6 ' + styles.textRight}>
            <button type="button" className="btn btn-azul" onClick={() => agregar()}>
              <PlusIcon />
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
                    medicamentos.map((medicamento) => (
                      <option value={medicamento.idmedicamento} key={medicamento.idmedicamento}>
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
                    medicamentos.map((medicamento) => (
                      <option value={medicamento.idmedicamento} key={medicamento.idmedicamento}>
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
                  <th scope="col">Nombre de Medicamento</th>
                  <th scope="col">Dosis en mg</th>
                  <th scope="col">Hora de Toma</th>
                  <th scope="col">Fecha de Prescripción</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {indicaciones &&
                  indicaciones
                    .filter((indicacion) => indicacion.borrado === 0)
                    .map((indicacion) => (
                      <tr key={indicacion.idindicacion}>
                        <td>{indicacion.idmedicamento.nombre}</td>
                        <td>{indicacion.cantidadmiligramos} mg</td>
                        <td>Cada {utils.convertirFormatoHora(indicacion.horadetoma)} hs</td>
                        <td>{utils.convertirFormatoFecha(indicacion.fechaprescripcion)}</td>
                        <td>{utils.convertirEstado(indicacion.estavigente)}</td>
                        <td>
                          <button
                            type="button"
                            className={'btn btn-verde ' + styles.rowActionButton}
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
                            <PencilIcon />
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

export default ListaIndicacion;
