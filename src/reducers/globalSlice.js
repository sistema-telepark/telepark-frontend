import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  idEpElegido: '',
  nombreEpElegido: '',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    cambiar: (state, action) => {
      state.idEpElegido = action.payload.idPersona;
      state.nombreEpElegido = action.payload.nombrePersona;
    },
  },
});

export const { cambiar } = globalSlice.actions;
export default globalSlice.reducer;
