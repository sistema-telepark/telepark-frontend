import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { departamentoRepository } from '../../services/departamento.service';
import { localidadRepository } from '../../services/localidad.service';

const Vivienda = ({ register, errors, watch, tipo, setValue, arrayProvincias }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [cargandoDepartamentos, setCargandoDepartamentos] = useState(false);
  const [cargandoLocalidades, setCargandoLocalidades] = useState(false);
  const provinciaSeleccionada = watch('provincia' + tipo);
  const departamentoSeleccionado = watch('departamento' + tipo);

  useEffect(() => {
    let activo = true;

    if (!provinciaSeleccionada) {
      setDepartamentos([]);
      setCargandoDepartamentos(false);
      return undefined;
    }

    setCargandoDepartamentos(true);
    setValue('departamento' + tipo, '');
    const cargarDepartamentos = async () => {
      try {
        const response = await departamentoRepository.getByProvincia(provinciaSeleccionada);
        if (activo) {
          if (response && response.data) {
            setDepartamentos(response.data);
          } else {
            setDepartamentos([]);
          }
        }
      } finally {
        if (activo) {
          setCargandoDepartamentos(false);
        }
      }
    };
    cargarDepartamentos();

    return () => {
      activo = false;
    };
  }, [provinciaSeleccionada, setValue, tipo]);

  useEffect(() => {
    let activo = true;

    setValue('localidad' + tipo, '');

    if (!departamentoSeleccionado) {
      setLocalidades([]);
      setCargandoLocalidades(false);
      return undefined;
    }

    setCargandoLocalidades(true);
    const cargarLocalidades = async () => {
      try {
        const response = await localidadRepository.getByDepartamento(departamentoSeleccionado);
        if (activo) {
          if (response && response.data) {
            setLocalidades(response.data);
          } else {
            setLocalidades([]);
          }
        }
      } finally {
        if (activo) {
          setCargandoLocalidades(false);
        }
      }
    };
    cargarLocalidades();

    return () => {
      activo = false;
    };
  }, [departamentoSeleccionado, setValue, tipo]);

  return (
    <div>
      <div className="row mt-4">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <h3>Datos de Vivienda</h3>
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Provincia</label>
          <select
            type="text"
            className="form-select"
            {...register('provincia' + tipo, {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Provincia</option>
            {arrayProvincias &&
              arrayProvincias.map((provincia) => (
                <option value={provincia.idprovincia} key={provincia.idprovincia}>
                  {provincia.provincia}
                </option>
              ))}
          </select>
          {errors['provincia' + tipo] && (
            <small className="field-error">{errors['provincia' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Departamento</label>
          <select
            type="text"
            className="form-select"
            disabled={!provinciaSeleccionada || cargandoDepartamentos}
            {...register('departamento' + tipo, {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Departamento</option>
            {departamentos &&
              departamentos.map((departamento) => (
                <option value={departamento.iddepartamento} key={departamento.iddepartamento}>
                  {departamento.nombre}
                </option>
              ))}
          </select>
          {errors['departamento' + tipo] && (
            <small className="field-error">{errors['departamento' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Localidad</label>
          <select
            className="form-select"
            disabled={!departamentoSeleccionado || cargandoLocalidades}
            {...register('localidad' + tipo, {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Localidad</option>
            {localidades.map((localidad) => (
              <option value={localidad.idlocalidad} key={localidad.idlocalidad}>
                {localidad.nombre}
              </option>
            ))}
          </select>
          {errors['localidad' + tipo] && (
            <small className="field-error">{errors['localidad' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Calle</label>
          <input
            type="text"
            className="form-control"
            placeholder="Calle"
            {...register('calle' + tipo, {
              required: {
                value: true,
                message: 'El campo no puede estar vacío',
              },
            })}
          />
          {errors['calle' + tipo] && (
            <small className="field-error">{errors['calle' + tipo].message}</small>
          )}
        </div>
      </div>
      <div className="row">
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Número</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Número"
            {...register('numero' + tipo, {
              required: {
                value: true,
                message: 'El campo no puede estar vacío',
              },
              pattern: {
                value: /^-?[0-9]\d*\.?\d*$/g,
                message: 'El campo debe contener solo números',
              },
            })}
          />
          {errors['numero' + tipo] && (
            <small className="field-error">{errors['numero' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Depto</label>
          <input
            type="text"
            className="form-control"
            placeholder="Departamento"
            {...register('deptoEdificio' + tipo, {
              pattern: {
                value: /^[a-zA-Z0-9]+$/g,
                message: 'El campo debe contener solo letras y números',
              },
            })}
          />
          {errors['deptoEdificio' + tipo] && (
            <small className="field-error">{errors['deptoEdificio' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Piso</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Piso"
            {...register('piso' + tipo, {
              pattern: {
                value: /^-?[0-9]\d*\.?\d*$/g,
                message: 'El campo debe contener solo números',
              },
            })}
          />
          {errors['piso' + tipo] && (
            <small className="field-error">{errors['piso' + tipo].message}</small>
          )}
        </div>
      </div>
    </div>
  );
};

Vivienda.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.objectOf(
    PropTypes.shape({
      message: PropTypes.string,
    })
  ).isRequired,
  watch: PropTypes.func.isRequired,
  tipo: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  arrayProvincias: PropTypes.arrayOf(
    PropTypes.shape({
      idprovincia: PropTypes.number.isRequired,
      provincia: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Vivienda;