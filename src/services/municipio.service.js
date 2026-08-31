import http from '../http-common';
import { withServiceHandler } from './error-handler';

const municipios = {
  async getAll() {
    const response = await http.get(`/municipios`);
    return response.data.results ?? response.data;
  },
  async getByProvincia(idprovincia) {
    const response = await http.get(`/municipios`, { params: { idprovincia } });
    return response.data.results ?? response.data;
  },
};

export const municipioRepository = {
  getAll: withServiceHandler(municipios.getAll, { context: 'obtener municipios' }),
  getByProvincia: withServiceHandler(municipios.getByProvincia, {
    context: 'obtener municipios por provincia',
  }),
};
