import React, { useState, useEffect } from 'react';
import { eventRespository } from '../services/event.service';
import Swal from 'sweetalert2';
import { PlusIcon } from './icons/icons-shared';
import styles from '../styles/gestion-eventos.module.css';

const Events = () => {
  const [typeEvent, setTypeEvent] = useState([]);
  const [namePersonEP, setNamePersonEP] = useState([]);
  const [error, setError] = useState({});
  const [events, setEvents] = useState({
    idEvento: 0,
    fechaDesde: '',
    fechaHasta: '',
    motivo: '',
    idpersonaep: 0,
    idtipoevento: 0,
  });

  useEffect(() => {
    getPersonAll();
    getTipeEvent();
  }, []);

  // Función que obtiene la lista de personas con ep
  // B01 (HITL 2026-08-11): /personas?espaciente=1 devuelve envelope DRF paginado
  // {count,next,previous,results} → normalizar a .results (patrón RA-13).
  const getPersonAll = async () => {
    let response = await eventRespository.getPersonAll();
    if (response && response.data) {
      setNamePersonEP(response.data.results ?? response.data);
    }
  };

  // Función que obtiene la lista de tipos de eventos
  const getTipeEvent = async () => {
    let response = await eventRespository.getEventAll();
    if (response) {
      setTypeEvent(response.data);
    }
  };

  const handleChange = (e) => {
    setEvents({
      ...events,
      [e.target.name]: e.target.value,
    });
  };

  const guardarNuevo = () => {
    let data = {};
    data = {
      fechadesde: events.fechaDesde,
      fechahasta: events.fechaHasta,
      motivo: events.motivo,
      idpersonaep: events.idpersonaep,
      idtipoevento: events.idtipoevento,
      borrado: 0,
    };

    eventRespository
      .createEvent(data)
      .then((response) => {
        if (response) {
          notificacionExito();
        }
      })
      .catch((error) => {
        notificacionError();
      });
  };

  //notificaciones
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
  //notificaciones
  const notificacionError = () => {
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
      icon: 'error',
      title: 'Error: Hubo un problema en la carga.',
    });
  };

  const validateDate = (fechaDesde, fechaHasta) => {
    if (fechaDesde !== '' && fechaHasta !== '') {
      return fechaDesde > fechaHasta;
    }
    return false;
  };

  const validate = validateDate(events.fechaDesde, events.fechaHasta);
  console.log(events, validate);

  return (
    <div className="container">
      <form id="myForm">
        <main className="justify-content-center row container-lg m-md-3 shadow mx-md-auto border-top-sm m-0">
          <h1 className="mt-4 mt-md-2 text-center">Gestión de eventos</h1>
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
                <strong>La Fecha de finalizacion es menor a la Fecha de inicio</strong>. Coloque
                una fecha de finalizacion mayor a la fecha de inicio.
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
                placeholder="Ingrese persona"
                name="idpersonaep"
                onChange={handleChange}
              >
                <option disabled={true} selected={true} defaultValue={-1}>
                  Seleccione una persona
                </option>
                {namePersonEP.map((element) => (
                  <option
                    id="idpersonaep"
                    key={element.idpersona.idpersona}
                    value={element.idpersona.idpersona}
                  >
                    {element.idpersona.nombre} {element.idpersona.apellido}
                  </option>
                ))}
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
                placeholder="Ingrese el tipo de evento"
                name="idtipoevento"
                onChange={handleChange}
              >
                <option disabled={true} selected={true} defaultValue={-1}>
                  Seleccione un tipo de evento
                </option>
                {typeEvent.map((element) => (
                  <option
                    id="idtipoevento"
                    key={element.idtipoevento}
                    value={element.idtipoevento}
                  >
                    {element.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className=" justify-content-center  d-flex mb-4">
              <button
                type="button"
                className="btn btn-primary mb-2 mt-2"
                disabled={validate}
                onClick={() => guardarNuevo()}
              >
                <PlusIcon className="signoMas" />
                Agregar
              </button>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
};
export default Events;
