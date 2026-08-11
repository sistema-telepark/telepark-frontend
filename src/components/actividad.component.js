import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { actividadRepository } from '../services/actividad.service';
import { tallerRepository } from '../services/taller.service';
import { showToast, showConfirm } from '../services/notification.service';
import { PlusIcon, TrashIcon } from './icons/icons-shared';
import { CheckIcon, CloseIcon } from './icons/icons-nomenclador';
import styles from '../styles/actividad.module.css';

const Actividad = () => {
  const [actividades, setActividades] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [editId, setEditId] = useState(null);

  const formActividad = useForm();

  useEffect(() => {
    getActividades();
    getTalleres();
  }, []);

  // Función que obtiene la lista de actividades
  const getActividades = async () => {
    const resp = await actividadRepository.getAll();
    if (resp.success) {
      setActividades(resp.data.results);
    }
  };

  // Función que obtiene la lista de talleres reales (fix D-5)
  const getTalleres = async () => {
    const resp = await tallerRepository.getTallerAll();
    if (resp.success) {
      setTalleres(resp.data.results);
    }
  };

  // Función que habilita la edición de un registro de la tabla
  const editar = (actividad) => {
    setEditId(actividad.idactividad);
    formActividad.reset({ nombre: actividad.nombre, idtaller: actividad.idtaller });
  };

  // Función que cancela la edición
  const cancelar = () => {
    setEditId(null);
    formActividad.reset({ nombre: '', idtaller: '' });
  };

  // Guarda la edición o agrega una nueva actividad
  const onSubmit = async (data) => {
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
  };

  // Función que elimina una actividad con confirmación y DELETE real
  const eliminar = async (actividad) => {
    const ok = await showConfirm(`¿Seguro que desea eliminar la actividad: ${actividad.nombre}?`);
    if (!ok) return;
    const resp = await actividadRepository.delete(actividad.idactividad);
    if (resp.success) {
      showToast('success', 'Eliminado con éxito');
      getActividades();
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
