import { cambiar } from '../reducers/globalSlice';

export const cambiarID = (id, nombre) => (dispatch) => {
  dispatch(cambiar({ idPersona: id, nombrePersona: nombre }));
};
