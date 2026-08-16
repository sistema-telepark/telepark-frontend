import React, { useEffect, useState } from 'react';
import utils from '../utils/utils';
import { enfermedadRepository } from '../services/enfermedad.service';
import { medicamentoRepository } from '../services/medicamento.service';
import { obrasocialRepository } from '../services/obrasocial.service';
import { CheckIcon, CloseIcon, AddIcon, EditIcon, DeleteIcon } from './icons/icons-nomenclador';
import styles from '../styles/nomenclador.module.css';

const Nomenclador = () => {
  const [type, setType] = useState('');
  const [enfermedades, setEnfermedades] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [obrasociales, setObrasociales] = useState([]);
  const [campo, setCampo] = useState({
    enfermedad: '',
    medicamento: '',
    obrasocial: '',
    isChecked: 0,
    idEditado: '',
  });

  useEffect(() => {
    getEnfermedad();
    getMedicamento();
    getObrasocial();
  }, []);

  // Funcion que obtiene la lista de enfermedades
  const getEnfermedad = async () => {
    const response = await enfermedadRepository.getAll().catch(() => undefined);
    if (response) {
      setEnfermedades(response.data);
    }
  };

  // Funcion que obtiene la lista de medicamentos
  const getMedicamento = async () => {
    let response = await medicamentoRepository.getAll().catch(() => undefined);
    if (response) {
      setMedicamentos(response.data);
    }
  };

  // Funcion que obtiene la lista de obras sociales
  const getObrasocial = async () => {
    let response = await obrasocialRepository.getAll().catch(() => undefined);
    if (response) {
      setObrasociales(response.data);
    }
  };

  // Funcion que guarda el valor de los campos
  const detectarCambio = (e) => {
    const { name, value } = e.target;
    setCampo({ ...campo, [name]: value });
  };

  // Funcion que guarda el valor del checkbox
  const detectarCheck = (e) => {
    const { name, checked } = e.target;
    setCampo({ ...campo, [name]: utils.convertirCheck(checked) });
  };

  // Funcion que habilita la edicion de un registro de la tabla seleccionada
  const editar = (tipo, info, id) => {
    setType(tipo);
    switch (tipo) {
      case 'enfermedad':
        setCampo({ enfermedad: info.nombre, idEditado: id });
        break;
      case 'medicamento':
        setCampo({ medicamento: info.nombre, idEditado: id });
        break;
      case 'obrasocial':
        setCampo({ obrasocial: info.nombre, isChecked: info.isChecked, idEditado: id });
        break;
      default:
        break;
    }
  };

  // Funcion que cancela la edicion de la tabla seleccionada
  const cancelar = () => {
    setType('');
    setCampo({ enfermedad: '', medicamento: '', obrasocial: '', isChecked: 0, idEditado: '' });
  };

  // Funcion que guarda la edicion de la tabla seleccionada
  const guardar = async (tipo) => {
    let nombre = campo[tipo];
    let esestatal = tipo === 'obrasocial' ? campo.isChecked : undefined;
    let id = campo.idEditado;
    if (nombre !== '') {
      switch (tipo) {
        case 'enfermedad':
          {
            const response = await enfermedadRepository
              .update(id, { nombre })
              .catch(() => undefined);
            if (response) {
              getEnfermedad();
              utils.notificacionGuardar();
            }
          }
          break;
        case 'medicamento':
          {
            const response = await medicamentoRepository
              .update(id, { nombre })
              .catch(() => undefined);
            if (response) {
              getMedicamento();
              utils.notificacionGuardar();
            }
          }
          break;
        case 'obrasocial':
          {
            const response = await obrasocialRepository
              .update(id, { nombre, esestatal })
              .catch(() => undefined);
            if (response) {
              getObrasocial();
              utils.notificacionGuardar();
            }
          }
          break;
        default:
          break;
      }
      cancelar();
    }
  };

  // Funcion que elimina un registro de la tabla elegida
  const eliminar = async (tipo, id) => {
    switch (tipo) {
      case 'enfermedad':
        {
          const response = await enfermedadRepository.delete(id).catch(() => undefined);
          if (response) {
            getEnfermedad();
          }
        }
        break;
      case 'medicamento':
        {
          const response = await medicamentoRepository.delete(id).catch(() => undefined);
          if (response) {
            getMedicamento();
          }
        }
        break;
      case 'obrasocial':
        {
          const response = await obrasocialRepository.delete(id).catch(() => undefined);
          if (response) {
            getObrasocial();
          }
        }
        break;
      default:
        break;
    }
    cancelar();
  };

  // Funcion que agrega un registro a la tabla elegida
  const cargarNuevo = async (tipo) => {
    let nombre = campo[tipo];
    let esestatal = tipo === 'obrasocial' ? campo.isChecked : false;
    if (nombre !== '') {
      switch (tipo) {
        case 'enfermedad':
          {
            const response = await enfermedadRepository.create({ nombre }).catch(() => undefined);
            if (response) {
              getEnfermedad();
              utils.notificacionGuardar();
            }
          }
          break;
        case 'medicamento':
          {
            const response = await medicamentoRepository.create({ nombre }).catch(() => undefined);
            if (response) {
              getMedicamento();
              utils.notificacionGuardar();
            }
          }
          break;
        case 'obrasocial':
          {
            const response = await obrasocialRepository
              .create({ nombre, esestatal })
              .catch(() => undefined);
            if (response) {
              getObrasocial();
              utils.notificacionGuardar();
            }
          }
          break;
        default:
          break;
      }
      cancelar();
    }
  };

  return (
    <main className="container form-paciente">
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h3>Ingresar Nomencladores</h3>
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="mt-4 mb-4 col-12 col-md-12 col-lg-4 col-xl-4">
          <div className="row">
            <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12 input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enfermedad..."
                id="enfermedad"
                name="enfermedad"
                onChange={detectarCambio}
                value={!campo.enfermedad ? '' : campo.enfermedad}
              />
              {type === 'enfermedad' ? (
                <span>
                  <button
                    type="button"
                    className="btn btn-azul-simple"
                    onClick={() => guardar('enfermedad')}
                    aria-label="Guardar enfermedad"
                  >
                    <CheckIcon />
                  </button>
                  <button
                    type="button"
                    className="btn btn-rojo-simple"
                    onClick={() => cancelar()}
                    aria-label="Cancelar"
                  >
                    <CloseIcon />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-azul-simple"
                  onClick={() => cargarNuevo('enfermedad')}
                  aria-label="Agregar enfermedad"
                >
                  <AddIcon />
                </button>
              )}
            </div>
          </div>

          <div className="row">
            <div className={'col-12 col-md-12 col-lg-12 col-xl-12 ' + styles.scrollableTable}>
              <table
                className={
                  'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
                }
              >
                <thead>
                  <tr>
                    <th scope="col">Enfermedad</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBodyMiddle}>
                  {enfermedades &&
                    enfermedades.map((enfermedad, index) => (
                      <tr key={enfermedad.idenfermedad}>
                        <td>{enfermedad.nombre}</td>
                        <td>
                          <button
                            type="button"
                            className={'btn btn-verde ' + styles.rowActionButton}
                            onClick={() =>
                              editar(
                                'enfermedad',
                                { nombre: enfermedad.nombre },
                                enfermedad.idenfermedad
                              )
                            }
                            aria-label={`Editar enfermedad: ${enfermedad.nombre}`}
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="btn btn-rojo"
                            onClick={() =>
                              utils.notificacionEliminar(
                                'enfermedad',
                                enfermedad.idenfermedad,
                                eliminar
                              )
                            }
                            aria-label={`Eliminar enfermedad: ${enfermedad.nombre}`}
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4 col-12 col-md-12 col-lg-4 col-xl-4">
          <div className="row">
            <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12 input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Medicamento..."
                id="medicamento"
                name="medicamento"
                onChange={detectarCambio}
                value={!campo.medicamento ? '' : campo.medicamento}
              />
              {type === 'medicamento' ? (
                <span>
                  <button
                    type="button"
                    className="btn btn-azul-simple"
                    onClick={() => guardar('medicamento')}
                    aria-label="Guardar medicamento"
                  >
                    <CheckIcon />
                  </button>
                  <button
                    type="button"
                    className="btn btn-rojo-simple"
                    onClick={() => cancelar()}
                    aria-label="Cancelar"
                  >
                    <CloseIcon />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-azul-simple"
                  onClick={() => cargarNuevo('medicamento')}
                  aria-label="Agregar medicamento"
                >
                  <AddIcon />
                </button>
              )}
            </div>
          </div>

          <div className="row">
            <div className={'mb-4 col-12 col-md-12 col-lg-12 col-xl-12 ' + styles.scrollableTable}>
              <table
                className={
                  'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
                }
              >
                <thead>
                  <tr>
                    <th scope="col">Medicamento</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBodyMiddle}>
                  {medicamentos &&
                    medicamentos.map((medicamento, index) => (
                      <tr key={medicamento.idmedicamento}>
                        <td>{medicamento.nombre}</td>
                        <td>
                          <button
                            type="button"
                            className={'btn btn-verde ' + styles.rowActionButton}
                            onClick={() =>
                              editar(
                                'medicamento',
                                { nombre: medicamento.nombre },
                                medicamento.idmedicamento
                              )
                            }
                            aria-label={`Editar medicamento: ${medicamento.nombre}`}
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="btn btn-rojo"
                            onClick={() =>
                              utils.notificacionEliminar(
                                'medicamento',
                                medicamento.idmedicamento,
                                eliminar
                              )
                            }
                            aria-label={`Eliminar medicamento: ${medicamento.nombre}`}
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4 col-12 col-md-12 col-lg-4 col-xl-4">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 col-xl-12 input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Obra Social..."
                id="obrasocial"
                name="obrasocial"
                onChange={detectarCambio}
                value={!campo.obrasocial ? '' : campo.obrasocial}
              />
              {type === 'obrasocial' ? (
                <span>
                  <button
                    type="button"
                    className="btn btn-azul-simple"
                    onClick={() => guardar('obrasocial')}
                    aria-label="Guardar obra social"
                  >
                    <CheckIcon />
                  </button>
                  <button
                    type="button"
                    className="btn btn-rojo-simple"
                    onClick={() => cancelar()}
                    aria-label="Cancelar"
                  >
                    <CloseIcon />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-azul-simple"
                  onClick={() => cargarNuevo('obrasocial')}
                  aria-label="Agregar obra social"
                >
                  <AddIcon />
                </button>
              )}
            </div>
            <div className="col-12 col-md-12 col-lg-12 col-xl-12">
              <label>
                Es Pública
                <input
                  type="checkbox"
                  className={'form-check-input ' + styles.checkInline}
                  name="isChecked"
                  onChange={detectarCheck}
                  checked={!campo.isChecked ? false : campo.isChecked}
                />
              </label>
            </div>
          </div>

          <div className="row">
            <div className={'mb-2 col-12 col-md-12 col-lg-12 col-xl-12 ' + styles.scrollableTable}>
              <table
                className={
                  'table table-bordered table-hover shadow table-striped ' + styles.tableFullWidth
                }
              >
                <thead>
                  <tr>
                    <th scope="col">Obra Social</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBodyMiddle}>
                  {obrasociales &&
                    obrasociales.map((obrasocial, index) => (
                      <tr key={obrasocial.idobrasocial}>
                        <td>{obrasocial.nombre}</td>
                        <td>
                          <button
                            type="button"
                            className={'btn btn-verde ' + styles.rowActionButton}
                            onClick={() =>
                              editar(
                                'obrasocial',
                                { nombre: obrasocial.nombre, isChecked: obrasocial.esestatal },
                                obrasocial.idobrasocial
                              )
                            }
                            aria-label={`Editar obra social: ${obrasocial.nombre}`}
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="btn btn-rojo"
                            onClick={() =>
                              utils.notificacionEliminar(
                                'obrasocial',
                                obrasocial.idobrasocial,
                                eliminar
                              )
                            }
                            aria-label={`Eliminar obra social: ${obrasocial.nombre}`}
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Nomenclador;
