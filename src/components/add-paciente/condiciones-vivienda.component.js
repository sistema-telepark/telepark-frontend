import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/condiciones-vivienda.module.css';

const CondicionesVivienda = ({ register }) => {
  return (
    <div className="row mt-3 justify-content-center">
      <div className="col-12 col-md-12 col-lg-4 col-xl-3">
        <label>
          <input
            className={'form-check-input ' + styles.checkboxMargin}
            type="checkbox"
            {...register('viveSoloEP')}
          />
          Vive Solo
        </label>
      </div>

      <div className="col-12 col-md-12 col-lg-4 col-xl-3">
        <label>
          <input
            className={'form-check-input ' + styles.checkboxMargin}
            type="checkbox"
            {...register('tieneCuidadorEP')}
          />
          Tiene Cuidador
        </label>
      </div>

      <div className="col-12 col-md-12 col-lg-4 col-xl-3">
        <label className={styles.checkLabel}>
          <input
            className={'form-check-input ' + styles.checkboxMargin}
            type="checkbox"
            {...register('tieneAcompananteEP')}
          />
          Tiene Acompañante Terapeútico
        </label>
      </div>
    </div>
  );
};

CondicionesVivienda.propTypes = {
  register: PropTypes.func.isRequired,
};

export default CondicionesVivienda;
