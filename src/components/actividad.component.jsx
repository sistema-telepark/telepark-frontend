import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { actividadRepository } from '../services/actividad.service';
import { tallerRepository } from '../services/taller.service';
import { showToast, showConfirm } from '../services/notification.service';
import { PlusIcon, TrashIcon } from './icons/icons-shared';
import { CheckIcon, CloseIcon } from './icons/icons-nomenclador';
import { logAsyncError } from './error-boundary/logError';
import styles from '../styles/actividad.module.css';

const Actividad = () => {
  const [actividades, setActividades] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [editId, setEditId] = useState(null);

  const formActividad = useForm();

  useEffect(() => {
    let activo = true;
    getActividades(() => activo);
    getTalleres(() => activo);
    return () => {
      activo = false;
    };
  }, []);

  const getActividades = async (isActivo = () => true) => {
    try {
      const resp = await actividadRepository.getAll();
      if (!isActivo()) return;
      if (resp.success) {
        setActividades(resp.data.results);
      }
    } catch (error) {
      logAsyncError(error, { context: 'obtener actividades' });
    }
  };

  const getTalleres = async (isActivo = () => true) => {
    try {
      const resp = await tallerRepository.getTallerAll();
      if (!isActivo()) return;
      if (resp.success) {
        setTalleres(resp.data.results);
      }
    } catch (error) {
      logAsyncError(error, { context: 'obtener talleres' });
    }
  };

  const editar = (actividad) => {
    setEditId(actividad.idactividad);
    formActividad.reset({ nombre: actividad.nombre, idtaller: actividad.idtaller });
  };

  const cancelar = () => {
    setEditId(null);
    formActividad.reset({ nombre: '', idtaller: '' });
  };

  const onSubmit = async (data) => {
    try {
      if (editId) {
        const resp = await actividadRepository.update(editId, {
          nombre: data.nombre,
          idtaller: data.idtaller,
        });
        if (resp.success) {
          showToast('success', 'Se ha guardado con éxito');
          getActividades();
          setEditId(null);
          formActividad.reset();
        }
        return;
      }

      const resp = await actividadRepository.create({
        nombre: data.nombre,
        idtaller: data.idtaller,
      });
      if (resp.success) {
        showToast('success', 'Se ha guardado con éxito');
        getActividades();
        formActividad.reset();
      }
    } catch (error) {
      logAsyncError(error, { context: 'guardar actividad' });
    }
  };

  const eliminar = async (actividad) => {
    try {
      const ok = await showConfirm(`¿Seguro que desea eliminar la actividad: ${actividad.nombre}?`);
      if (!ok) return;
      const resp = await actividadRepository.delete(actividad.idactividad);
      if (resp.success) {
        showToast('success', 'Eliminado con éxito');
        getActividades();
      }
    } catch (error) {
      logAsyncError(error, { context: 'eliminar actividad' });
    }
  };

  return (
    <div className="row">
      <div className={`mt-4 mb-4 col-12 col-md-12 col-lg-4 col-xl-4 ${styles.formColumn}`}>
        <div className="row">
          <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12 input-group">
            <input
              type="text"
              className="form-control"
              placeholder="actividad nombre..."
              id="nombre"
              {...formActividad.register('nombre', {
                required: 'El nombre de la actividad no puede estar vacío.',
              })}
            />
            <select
              className="form-select"
              placeholder="Taller"
              id="idtaller"
              {...formActividad.register('idtaller', { required: 'Debe seleccionar un taller.' })}
            >
              <option value="">Elija el taller</option>
              {talleres.map((taller) => (
                <option key={taller.idtaller} value={taller.idtaller}>
                  {taller.tipotaller}
                </option>
              ))}
            </select>

            {editId ? (
              <span>
                <button
                  type="button"
                  className="btn btn-azul-simple"
                  onClick={() => formActividad.handleSubmit(onSubmit)()}
                >
                  <CheckIcon />
                </button>
                <button type="button" className="btn btn-rojo-simple" onClick={() => cancelar()}>
                  <CloseIcon />
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="btn btn-azul-simple"
                onClick={() => formActividad.handleSubmit(onSubmit)()}
              >
                <PlusIcon />
              </button>
            )}
          </div>
          {formActividad.formState.errors.nombre && (
            <small className="text-danger">{formActividad.formState.errors.nombre.message}</small>
          )}
          {formActividad.formState.errors.idtaller && (
            <small className="text-danger">{formActividad.formState.errors.idtaller.message}</small>
          )}
        </div>

        <div className="row">
          <div className={`col-12 col-md-12 col-lg-12 col-xl-12 ${styles.scrollContainer}`}>
            <table className="table table-bordered table-hover shadow table-striped">
              <thead>
                <tr>
                  <th scope="col">nombre Actividad</th>
                  <th scope="col">idtaller</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody className={styles.tableBodyMiddle}>
                {actividades &&
                  actividades.map((actividad) => (
                    <tr key={actividad.idactividad}>
                      <td>{actividad.nombre}</td>
                      <td>{actividad.idtaller}</td>
                      <td>
                        <button
                          type="button"
                          className={`btn btn-verde ${styles.rowActionButton}`}
                          onClick={() => editar(actividad)}
                        >
                          <PlusIcon />
                        </button>
                        <button
                          type="button"
                          className="btn btn-rojo"
                          onClick={() => eliminar(actividad)}
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
    </div>
  );
};

export default Actividad;
