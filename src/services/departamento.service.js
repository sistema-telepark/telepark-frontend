import http from '../http-common';
import { withServiceHandler } from './error-handler';

const departamentos = {
  async getAll() {
    const response = await http.get(`/departamentos`);
    return response.data.results ?? response.data;
  },
  async getByProvincia(idprovincia) {
    const response = await http.get(`/departamentos`, { params: { idprovincia } });
    return response.data.results ?? response.data;
  },
};

export const departamentoRepository = {
  getAll: withServiceHandler(departamentos.getAll, { context: 'obtener departamentos' }),
  getByProvincia: withServiceHandler(departamentos.getByProvincia, {
    context: 'obtener departamentos por provincia',
  }),
};