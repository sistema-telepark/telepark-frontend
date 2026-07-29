import { cambiar } from '../reducers/globalSlice';

export const cambiarID = (id, nombre) => (dispatch) => {
  try {
    dispatch(cambiar({ idPersona: id, nombrePersona: nombre }));
  } catch (err) {
    console.log(err);
  }
};
