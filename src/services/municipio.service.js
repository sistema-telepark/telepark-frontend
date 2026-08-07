import http from '../http-common';
import { withServiceHandler } from './error-handler';

const municipios = {
  async getAll() {
    const response = await http.get(`/municipios`);
    return response.data;
  },
};

export const municipioRepository = {
  getAll: withServiceHandler(municipios.getAll, { context: 'obtener municipios' }),
};
