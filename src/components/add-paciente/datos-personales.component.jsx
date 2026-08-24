import React from 'react';
import utils from '../../utils/utils';
import PropTypes from 'prop-types';

const DatosPersonales = ({ register, errors, tipo }) => {
  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h3>Datos Personales</h3>
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            {...register('nombre' + tipo, {
              required: {
                value: true,
                message: 'El campo no puede estar vacío',
              },
              minLength: {
                value: 2,
                message: 'El campo no puede tener menos de 2 caracteres',
              },
            })}
          />
          {errors['nombre' + tipo] && (
            <small className="field-error">{errors['nombre' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Apellido</label>
          <input
            type="text"
            className="form-control"
            placeholder="Apellido"
            {...register('apellido' + tipo, {
              required: {
                value: true,
                message: 'El campo no puede estar vacío',
              },
              minLength: {
                value: 2,
                message: 'El campo no puede tener menos de 2 caracteres',
              },
            })}
          />
          {errors['apellido' + tipo] && (
            <small className="field-error">{errors['apellido' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Sexo</label>
          <select
            type="text"
            className="form-select"
            {...register('sexo' + tipo, {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          {errors['sexo' + tipo] && (
            <small className="field-error">{errors['sexo' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Fecha de Nacimiento</label>
          <input
            type="date"
            className="form-control"
            placeholder="Fecha de Nacimiento"
            max={utils.fechaActual()}
            {...register('nacimiento' + tipo, {
              required: {
                value: true,
                message: 'El campo no puede estar vacío',
              },
            })}
          />
          {errors['nacimiento' + tipo] && (
            <small className="field-error">{errors['nacimiento' + tipo].message}</small>
          )}
        </div>
      </div>
      <div className="row">
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Teléfono"
            {...register('telefono' + tipo, {
              required: {
                value: true,
                message: 'El campo no puede estar vacío',
              },
              pattern: {
                value: /^-?[0-9]\d*\.?\d*$/g,
                message: 'El número de teléfono no es válido',
              },
            })}
          />
          {errors['telefono' + tipo] && (
            <small className="field-error">{errors['telefono' + tipo].message}</small>
          )}
        </div>
      </div>
    </div>
  );
};

DatosPersonales.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(
    PropTypes.shape({
      message: PropTypes.string,
    })
  ).isRequired,
  tipo: PropTypes.string.isRequired,
};

export default DatosPersonales;
