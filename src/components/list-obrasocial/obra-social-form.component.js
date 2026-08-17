import React from 'react';
import styles from '../../styles/obra-social-form.module.css';
import PropTypes from 'prop-types';

const ObraSocialForm = ({
  titulo,
  funcionCambiar,
  value,
  obrasociales,
  funcionConfirmar,
  funcionCancelar,
}) => {
  return (
    <div>
      <div className="row form-paciente">
        <h4>{titulo}</h4>
        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
          <label className="col-form-label">Obra Social</label>
          <select
            className="form-select"
            placeholder="Ingrese O.Social..."
            id="obrasocial"
            name="obrasocial"
            onChange={funcionCambiar}
            value={value}
          >
            <option value="">Elegir</option>
            {obrasociales &&
              obrasociales.map((obrasocial) => (
                <option value={obrasocial.idobrasocial} key={obrasocial.idobrasocial}>
                  {obrasocial.nombre}
                </option>
              ))}
          </select>
        </div>
        <div className={'col-12 col-md-6 col-lg-6 col-xl-6 ' + styles.formActions}>
          <button
            type="submit"
            className={'btn btn-verde ' + styles.submitButton}
            onClick={() => funcionConfirmar()}
          >
            Confirmar
          </button>
          <button
            type="submit"
            className={'btn btn-rojo ' + styles.cancelButton}
            onClick={() => funcionCancelar()}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

ObraSocialForm.propTypes = {
  titulo: PropTypes.string.isRequired,
  funcionCambiar: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  obrasociales: PropTypes.arrayOf(
    PropTypes.shape({
      idobrasocial: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ),
  funcionConfirmar: PropTypes.func.isRequired,
  funcionCancelar: PropTypes.func.isRequired,
};

export default ObraSocialForm;
