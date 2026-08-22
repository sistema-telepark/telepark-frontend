import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { pacienteRepository } from '../services/paciente.service';
import { provinciaRepository } from '../services/provincia.service';
import Vivienda from './add-paciente/vivienda.component';
import DatosPersonales from './add-paciente/datos-personales.component';
import CondicionesVivienda from './add-paciente/condiciones-vivienda.component';
import utils from '../utils/utils';
import styles from '../styles/add-paciente.module.css';

const AddPaciente = () => {
  const [arrayProvincias, setArrayProvincias] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const cargarProvincias = async () => {
      const response = await provinciaRepository.getAll();
      if (response && response.data) {
        setArrayProvincias(
          response.data.map((provincia) => ({
            idprovincia: provincia.idprovincia,
            provincia: provincia.nombre,
          }))
        );
      }
    };

    cargarProvincias();
  }, []);

  const enviarFormulario = async (data) => {
    const response = await pacienteRepository.guardarPaciente(data).catch(() => null);

    if (response?.success) {
      utils.send();
      reset();
    } else {
      utils.errorSend();
    }
  };

  const customSubmit = (data) => {
    enviarFormulario(data);
  };

  return (
    <form onSubmit={handleSubmit(customSubmit)} className="container panel-gris">
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h2 className="mt-4 text-center">Persona con EP</h2>
          <hr />
          <br />
        </div>
      </div>

      <DatosPersonales register={register} errors={errors} tipo="EP" />

      <CondicionesVivienda register={register} />

      <Vivienda
        register={register}
        errors={errors}
        watch={watch}
        tipo="EP"
        setValue={setValue}
        arrayProvincias={arrayProvincias}
      />

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

      <div className={'row ' + styles.referenteSection}>
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h2 className="mt-4 text-center">Referente</h2>
        </div>
      </div>

      <DatosPersonales register={register} errors={errors} tipo="R" />

      <Vivienda
        register={register}
        errors={errors}
        watch={watch}
        tipo="R"
        setValue={setValue}
        arrayProvincias={arrayProvincias}
      />

      <div className="row">
        <div className={'col-12 col-md-12 col-lg-12 col-xl-12 ' + styles.confirmCenter}>
          <button type="submit" className="mt-3 btn btn-verde">

            Guardar
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPaciente;
