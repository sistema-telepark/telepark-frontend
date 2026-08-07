import React from 'react';

const Vivienda = (register, errors, watch, tipo, arrayProvincias, municipios) => {
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
              arrayProvincias.map((provincia, index) => (
                <option value={provincia.provincia} key={provincia.idprovincia ?? provincia.provincia}>
                  {provincia.provincia}
                </option>
              ))}
          </select>
          {errors['provincia' + tipo] && (
            <small className="field-error">{errors['provincia' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Municipio</label>
          <select
            type="text"
            className="form-select"
            {...register('municipio' + tipo, {
              required: {
                value: true,
                message: 'Debe seleccionar una opción',
              },
            })}
          >
            <option value="">Municipio</option>
            {municipios &&
              municipios
                .filter((municipio) => municipio.provincia === watch('provincia' + tipo))
                .map((municipio, index) => (
                  <option value={municipio.idmunicipio} key={municipio.idmunicipio}>
                    {municipio.nombre}
                  </option>
                ))}
          </select>
          {errors['municipio' + tipo] && (
            <small className="field-error">{errors['municipio' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Localidad</label>
          <input
            type="text"
            className="form-control"
            placeholder="Localidad"
            {...register('localidad' + tipo, {
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
          <label className="col-form-label">Departamento</label>
          <input
            type="text"
            className="form-control"
            placeholder="Departamento"
            {...register('departamento' + tipo, {
              required: {
                value: true,
                message: 'El campo no puede estar vacío',
              },
            })}
          />
          {errors['departamento' + tipo] && (
            <small className="field-error">{errors['departamento' + tipo].message}</small>
          )}
        </div>
        <div className="mt-2 col-12 col-md-6 col-lg-4 col-xl-3">
          <label className="col-form-label">Piso</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Piso"
            {...register('piso' + tipo, {
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
          {errors['piso' + tipo] && (
            <small className="field-error">{errors['piso' + tipo].message}</small>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vivienda;
