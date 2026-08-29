// DEPRECATED: Reemplazado por globalSlice.js (Redux Toolkit createSlice).
// Mantenido temporalmente como referencia.
import { CAMBIAR } from '../actions/types';

const initialState = {
  idEpElegido: '',
  nombreEpElegido: '',
};

function globalReducer(global = initialState, action) {
  switch (action.type) {
    case CAMBIAR:
      return {
        ...global,
        idEpElegido: action.idPersona,
        nombreEpElegido: action.nombrePersona,
      };
    default:
      return global;
  }
}

export default globalReducer;
