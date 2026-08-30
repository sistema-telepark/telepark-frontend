import React, { useRef, useState, useEffect } from 'react';
import { eventRespository } from '../services/event.service';
import Swal from 'sweetalert2';
import { PlusIcon } from './icons/icons-shared';
import ErrorFallbackInline from './error-boundary/error-fallback-inline.component';
import LoadingSpinner from './shared/loading-spinner';
import styles from '../styles/gestion-eventos.module.css';

const initialEvents = {
  fechaDesde: '',
  fechaHasta: '',
  motivo: '',
  idpersonaep: '',
  idtipoevento: '',
};

const Events = () => {
  const [typeEvent, setTypeEvent] = useState([]);
  const [namePersonEP, setNamePersonEP] = useState([]);
  const [events, setEvents] = useState(initialEvents);

  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    Promise.all([getPersonEpAll(), getTipeEvent()])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recargar = () => {
    setLoadError(null);
    Promise.all([getPersonEpAll(), getTipeEvent()]).catch(() => {});
  };

  // El backend devuelve envelope DRF paginado {count,next,previous,results}
  // → normalizar a .results.
  const getPersonEpAll = async () => {
    let response = await eventRespository.getPersonEp();
    if (response?.success && response?.data) {
      setNamePersonEP(response.data.results ?? response.data);
      setLoadError(null);
    } else {
      setLoadError(response.error);
    }
  };

  const getTipeEvent = async () => {
    let response = await eventRespository.getEventAll();
    if (response?.success && response?.data) {
      setTypeEvent(response.data);
      setLoadError(null);
    } else {
      setLoadError(response.error);
    }
  };

  const handleChange = (e) => {
    setEvents((currentEvents) => ({
      ...currentEvents,
      [e.target.name]: e.target.value,
    }));
  };

  const guardarNuevo = () => {
    let data = {};
    data = {
      fechadesde: events.fechaDesde || null,
      fechahasta: events.fechaHasta || null,
      motivo: events.motivo,
      idpersonaep: events.idpersonaep,
      idtipoevento: events.idtipoevento,
      borrado: 0,
    };

    eventRespository.createEvent(data).then((response) => {
      if (response?.success) {
        setEvents(initialEvents);
        formRef.current.reset();
        notificacionExito();
      }
    });
  };

  const notificacionExito = () => {
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
  const validateDate = (fechaDesde, fechaHasta) => {
    if (fechaDesde !== '' && fechaHasta !== '') {
      return fechaDesde > fechaHasta;
    }
    return false;
  };

  const validate = validateDate(events.fechaDesde, events.fechaHasta);

  return (
    <div>
      <form
        ref={formRef}
        id="myForm"
        onSubmit={(e) => {
          e.preventDefault();
          if (!validate) guardarNuevo();
        }}
      >
        <main className="justify-content-center row container-lg m-md-3 shadow mx-md-auto border-top-sm m-0 panel-gris">
          <h2 className="mt-4 text-center">Gestión de eventos</h2>
          <hr />
          <div className="row">
            <div className="form-grup mb-4">
              <label htmlFor="fechaDesde" className="control-label">
                Fecha de inicio
              </label>
              <input
                type="date"
                name="fechaDesde"
                id="fechaDesde"
                className="form-control"
                placeholder="Fecha de inicio"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-grup mb-4 ">
              <label htmlFor="fechaHasta" className="control-label">
                Fecha de finalizacion
              </label>
              <input
                type="date"
                name="fechaHasta"
                id="fechaHasta"
                className="form-control"
                placeholder="Fecha de finalizacion"
                onChange={handleChange}
              />
            </div>
          </div>
          {validate && (
            <div className="row">
              <span className={styles.errorText}>
                <strong>La Fecha de finalizacion es menor a la Fecha de inicio</strong>. Coloque una
                fecha de finalizacion mayor a la fecha de inicio.
              </span>
            </div>
          )}
          <div className="row">
            <div className="form-grup">
              <label htmlFor="motivo" className="control-label">
                Motivo
              </label>
              <textarea
                type="text"
                name="motivo"
                id="motivo"
                className="form-control textAreaMotivo"
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <br></br>
          <div className="row">
            <div className="form-grup mb-4">
              <label htmlFor="idpersonaep" className="control-label">
                Nombre del de la persona con ep
              </label>
              <select
                className="form-select"
                name="idpersonaep"
                onChange={handleChange}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Seleccione una persona
                </option>
                {namePersonEP.map((element) => {
                  return (
                    <option
                      id={`persona-${element.idpersona}`}
                      key={`persona-${element.idpersona}`}
                      value={element.idpersona}
                    >
                      {element.nombre} {element.apellido}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="form-grup mb-4">
              <label htmlFor="idtipoevento" className="control-label">
                Nombre del del tipo de evento
              </label>
              <select
                className="form-select"
                name="idtipoevento"
                onChange={handleChange}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Seleccione un tipo de evento
                </option>
                {typeEvent.map((element) => (
                  <option id="idtipoevento" key={element.idtipoevento} value={element.idtipoevento}>
                    {element.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className=" justify-content-center  d-flex mb-4">
              <button type="submit" className="btn btn-azul mb-2 mt-2" disabled={validate}>
                <PlusIcon className="signoMas" />
                Agregar
              </button>
            </div>
          </div>
          {loading && <LoadingSpinner />}
          {loadError && (
            <ErrorFallbackInline
              error={{ message: loadError }}
              resetErrorBoundary={recargar}
              message="Error al cargar los datos. Intente nuevamente."
            />
          )}
        </main>
      </form>
    </div>
  );
};
export default Events;
