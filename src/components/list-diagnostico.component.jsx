import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { diagnosticoRepository } from '../services/diagnostico.service';
import { enfermedadRepository } from '../services/enfermedad.service';
import utils from '../utils/utils';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import styles from '../styles/list-diagnostico.module.css';

const ListaDiagnostico = () => {
  const idEpElegido = useSelector((state) => state.global.idEpElegido);
  const nombreEpElegido = useSelector((state) => state.global.nombreEpElegido);
  const navigate = useNavigate();

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
    if (idEpElegido) {
      getDiagnosticos();
    } else {
      setDiagnosticos([]);
      navigate('/list-pacientes', { replace: true });
    }
  }, [idEpElegido, navigate]);

  // Funcion que obtiene la lista de enfermedades
  const getEnfermedad = async () => {
    let response = await enfermedadRepository.getAll();

    if (response) {
      setEnfermedades(response.data);
    }
  };

  // Funcion que obtiene la lista de diagnosticos de un paciente
  // M02 (HITL 2026-08-11): no llamar al service con idEpElegido vacío
  // (redux inicial '') — antes armaba `/personas-ep//diagnosticos` → 404.
  // Normalizar listado paginado DRF a .results (patrón RA-13).
  const getDiagnosticos = async () => {
    if (!idEpElegido) {
      setDiagnosticos([]);
      return;
    }

    let response = await diagnosticoRepository.get(idEpElegido);

    if (response && response.data) {
      setDiagnosticos(response.data.results ?? response.data);
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
    if (idEnfermedad !== '' && fechaEnfermedad !== '') {
      var data = {
        fecha: fechaEnfermedad,
        idpersonaep: Number(idEpElegido),
        idenfermedad: Number(idEnfermedad),
        borrado: 0,
      };
      diagnosticoRepository
        .update(id, data)
        .then((response) => {
          if (response?.success) {
            getDiagnosticos();
            notificacionGuardar();
          }
        })
        .catch(() => undefined);
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
  };

  const agregar = () => {
    setShowNuevo(true);
    setShow(false);
    setCampo({ enfermedad: '', fecha: '' });
  };

  const cargarNuevo = () => {
    let idEnfermedad = campo.enfermedad;
    let fechaEnfermedad = campo.fecha;
    if (idEnfermedad !== '' && fechaEnfermedad !== '') {
      let data = {
        fecha: fechaEnfermedad,
        idpersonaep: Number(idEpElegido),
        idenfermedad: Number(idEnfermedad),
        borrado: 0,
      };
      diagnosticoRepository
        .create(data)
        .then((reponse) => {
          if (reponse?.success) {
            getDiagnosticos();
            notificacionGuardar();
          }
        })
        .catch(() => undefined);
      setCampo({ enfermedad: '', fecha: '' });
      setShowNuevo(false);
    }
  };

  const eliminar = (idenfermedad, fecha, id) => {
    var data = {
      fecha: fecha,
      idpersonaep: Number(idEpElegido),
      idenfermedad: Number(idenfermedad),
      borrado: 1,
    };
    diagnosticoRepository
      .update(id, data)
      .then((response) => {
        if (response) {
          getDiagnosticos();
        }
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
      className={
        'border-top-sm m-0 row justify-content-center panel-gris m-md-3 rounded shadow container-lg mx-md-auto ' +
        styles.pageHeader
      }
    >
      <div className="mb-4 col-12 col-md-9 col-lg-12 col-xl-10">
        <h2 className="mt-4 text-center">Diagnóstico de Enfermadades</h2>
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
                    enfermedades.map((enfermedad) => (
                      <option value={enfermedad.idenfermedad} key={enfermedad.idenfermedad}>
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
                    enfermedades.map((enfermedad) => (
                      <option value={enfermedad.idenfermedad} key={enfermedad.idenfermedad}>
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
                  <th scope="col">Nombre de Enfermedad</th>
                  <th scope="col">Fecha de Diagnóstico</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {diagnosticos &&
                  diagnosticos
                    .filter((diagnostico) => diagnostico.borrado === 0)
                    .map((diagnostico) => (
                      <tr key={diagnostico.iddiagnostico}>
                        <td>{diagnostico.idenfermedad.nombre}</td>
                        <td>{utils.convertirFormatoFecha(diagnostico.fecha)}</td>
                        <td>
                          <button
                            type="button"
                            className={'btn btn-verde ' + styles.rowActionButton}
                            onClick={() =>
                              editar(
                                diagnostico.idenfermedad.idenfermedad,
                                diagnostico.fecha,
                                diagnostico.iddiagnostico
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
                                diagnostico.idenfermedad.idenfermedad,
                                diagnostico.fecha,
                                diagnostico.iddiagnostico
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

export default memo(ListaDiagnostico);
