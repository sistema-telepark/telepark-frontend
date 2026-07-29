import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { pacienteRepository } from '../services/pacienteService';
import { municipioRepository } from '../services/municipioService';
import Vivienda from './AddPaciente/Vivienda';
import DatosPersonales from './AddPaciente/DatosPersonales';
import utils from '../utils/utils';

const AddPaciente = () => {
  const [municipios, setMunicipios] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    getMunicipios();
  }, []);

  // Función que obtiene la lista de municipios
  const getMunicipios = async () => {
    const response = await municipioRepository.getAll().catch(() => undefined);
    if (response) {
      setMunicipios(response.data);
    }
  };

  const enviarFormulario = async (data) => {
    const response = await pacienteRepository.guardarPaciente(data).catch(() => utils.errorSend());
    if (response) {
      utils.send();
      reset();
    }
  };

  const customSubmit = (data) => {
    console.log(data);
    enviarFormulario(data);
  };

  console.log(watch('nombreEP'));

  return (
    <form onSubmit={handleSubmit(customSubmit)} className="container form-paciente">
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h1 className="text-center">Persona con EP</h1>
        </div>
      </div>

      {DatosPersonales(register, errors, 'EP')}

      <div className="row mt-3">
        <div className="col-12 col-md-12 col-lg-4 col-xl-3">
          <label>
            <input
              className="form-check-input"
              type="checkbox"
              {...register('viveSoloEP')}
              style={{ marginRight: '10px' }}
            />
            Vive Solo
          </label>
        </div>

        <div className="col-12 col-md-12 col-lg-4 col-xl-3">
          <label>
            <input
              className="form-check-input"
              type="checkbox"
              {...register('tieneCuidadorEP')}
              style={{ marginRight: '10px' }}
            />
            Tiene Cuidador
          </label>
        </div>

        <div className="col-12 col-md-12 col-lg-4 col-xl-3">
          <label style={{ inlineSize: 'max-content' }}>
            <input
              className="form-check-input"
              type="checkbox"
              {...register('tieneAcompananteEP')}
              style={{ marginRight: '10px' }}
            />
            Tiene Acompañante Terapeútico
          </label>
        </div>
      </div>

      {Vivienda(register, errors, watch, 'EP', utils.retornarProvincias(), municipios)}

      <div className="row mt-4">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h3>Otros Datos</h3>
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Maxima Escolaridad</label>
          <select
            type="text"
            className="form-select"
            {...register('escolaridadEP', {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Escolaridad </option>
            <option value="Sin Escolaridad">Sin Escolaridad</option>
            <option value="Primario">Primario</option>
            <option value="Secundario">Secundario</option>
            <option value="Terciario">Terciario</option>
            <option value="Universitario">Universitario</option>
          </select>
          {errors['escolaridadEP'] && (
            <small className="field-error">{errors['escolaridadEP'].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Nivel Completado</label>
          <select
            type="text"
            className="form-select"
            {...register('nivelCompletoEP', {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Elegir</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
          {errors['nivelCompletoEP'] && (
            <small className="field-error">{errors['nivelCompletoEP'].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Ocupacion Previa</label>
          <select
            type="text"
            className="form-select"
            {...register('ocupacionPEP', {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Profesion</option>
            <option value="Desocupado">Desocupado</option>
            <option value="Ocupado">Ocupado</option>
            <option value="Subocupado">Subocupado</option>
          </select>
          {errors['ocupacionPEP'] && (
            <small className="field-error">{errors['ocupacionPEP'].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Ocupacion Actual</label>
          <select
            type="text"
            className="form-select"
            {...register('ocupacionAEP', {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Profesion</option>
            <option value="Desocupado">Desocupado</option>
            <option value="Ocupado">Ocupado</option>
            <option value="Subocupado">Subocupado</option>
          </select>
          {errors['ocupacionAEP'] && (
            <small className="field-error">{errors['ocupacionAEP'].message}</small>
          )}
        </div>
      </div>

      <div className="row" style={{ marginTop: '50px' }}>
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h1 className="text-center">Referente</h1>
        </div>
      </div>

      {DatosPersonales(register, errors, 'R')}

      {Vivienda(register, errors, watch, 'R', utils.retornarProvincias(), municipios)}

      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12" style={{ textAlign: 'center' }}>
          <button type="submit" className="mt-3 btn btn-success">
            Confirmar
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPaciente;
