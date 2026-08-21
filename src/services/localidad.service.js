import http from '../http-common';
import { withServiceHandler } from './error-handler';

const localidades = {
  async getAll() {
    const response = await http.get(`/localidades`);
    return response.data.results ?? response.data;
  },
};

export const localidadRepository = {
  getAll: withServiceHandler(localidades.getAll, { context: 'obtener localidades' }),
};
