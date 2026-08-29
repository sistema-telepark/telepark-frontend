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

  const getEnfermedad = async () => {
    const response = await enfermedadRepository.getAll();
    if (response?.success) {
      setEnfermedades(response?.data ?? []);
    }
  };

  const getMedicamento = async () => {
    let response = await medicamentoRepository.getAll();
    if (response?.success) {
      setMedicamentos(response?.data ?? []);
    }
  };

  const getObrasocial = async () => {
    let response = await obrasocialRepository.getAll();
    if (response?.success) {
      setObrasociales(response?.data ?? []);
    }
  };

  const detectarCambio = (e) => {
    const { name, value } = e.target;
    setCampo({ ...campo, [name]: value });
  };

  const detectarCheck = (e) => {
    const { name, checked } = e.target;
    setCampo({ ...campo, [name]: utils.convertirCheck(checked) });
  };

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

  const cancelar = () => {
    setType('');
    setCampo({ enfermedad: '', medicamento: '', obrasocial: '', isChecked: 0, idEditado: '' });
  };

  const guardar = async (tipo) => {
    let nombre = campo[tipo];
    let esestatal = tipo === 'obrasocial' ? campo.isChecked : undefined;
    let id = campo.idEditado;
    if (nombre !== '') {
      switch (tipo) {
        case 'enfermedad':
          {
            const response = await enfermedadRepository.update(id, { nombre });
            if (response?.success) {
              getEnfermedad();
              utils.notificacionGuardar();
            }
          }
          break;
        case 'medicamento':
          {
            const response = await medicamentoRepository.update(id, { nombre });
            if (response?.success) {
              getMedicamento();
              utils.notificacionGuardar();
            }
          }
          break;
        case 'obrasocial':
          {
            const response = await obrasocialRepository.update(id, { nombre, esestatal });
            if (response?.success) {
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

  const eliminar = async (tipo, id) => {
    switch (tipo) {
      case 'enfermedad':
        {
          const response = await enfermedadRepository.delete(id);
          if (response?.success) {
            getEnfermedad();
          }
        }
        break;
      case 'medicamento':
        {
          const response = await medicamentoRepository.delete(id);
          if (response?.success) {
            getMedicamento();
          }
        }
        break;
      case 'obrasocial':
        {
          const response = await obrasocialRepository.delete(id);
          if (response?.success) {
            getObrasocial();
          }
        }
        break;
      default:
        break;
    }
    cancelar();
  };

  const cargarNuevo = async (tipo) => {
    let nombre = campo[tipo];
    let esestatal = tipo === 'obrasocial' ? campo.isChecked : false;
    if (nombre !== '') {
      switch (tipo) {
        case 'enfermedad':
          {
            const response = await enfermedadRepository.create({ nombre });
            if (response?.success) {
              getEnfermedad();
              utils.notificacionGuardar();
            }
          }
          break;
        case 'medicamento':
          {
            const response = await medicamentoRepository.create({ nombre });
            if (response?.success) {
              getMedicamento();
              utils.notificacionGuardar();
            }
          }
          break;
        case 'obrasocial':
          {
            const response = await obrasocialRepository.create({ nombre, esestatal });
            if (response?.success) {
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
    <main className="container panel-gris">
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h2 className="mt-4 text-center">Ingresar Nomencladores</h2>
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="mt-3 mb-4 col-12 col-md-12 col-lg-4 col-xl-4">
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
                  className="btn btn-azul"
                  onClick={() => cargarNuevo('enfermedad')}
                  aria-label="Agregar enfermedad"
                >
                  <AddIcon />
                </button>
              )}
            </div>
          </div>
          <br />
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

        <div className="mt-3 col-12 col-md-12 col-lg-4 col-xl-4">
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
                  className="btn btn-azul"
                  onClick={() => cargarNuevo('medicamento')}
                  aria-label="Agregar medicamento"
                >
                  <AddIcon />
                </button>
              )}
            </div>
          </div>
          <br />
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

        <div className="mt-3 col-12 col-md-12 col-lg-4 col-xl-4">
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
                  className="btn btn-azul"
                  onClick={() => cargarNuevo('obrasocial')}
                  aria-label="Agregar obra social"
                >
                  <AddIcon />
                </button>
              )}
            </div>
            <div className="col-12 col-md-12 col-lg-12 col-xl-12">
              <label className="form-label">
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
