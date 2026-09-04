import http from '../http-common';
import { withServiceHandler } from './error-handler';

const provincias = {
  async getAll() {
    const response = await http.get('/provincias');
    return response.data.results ?? response.data;
  },
};

export const provinciaRepository = {
  getAll: withServiceHandler(provincias.getAll, {
    context: 'obtener provincias',
  }),
};
