import http from '../http-common';
import { withServiceHandler } from './error-handler';

const localidades = {
  async getAll() {
    const response = await http.get(`/localidades`);
    return response.data.results ?? response.data;
  },
  async getByMunicipio(idmunicipio) {
    const response = await http.get(`/localidades`, { params: { idmunicipio } });
    return response.data;
  },
};

export const localidadRepository = {
  getAll: withServiceHandler(localidades.getAll, { context: 'obtener localidades' }),
  getByMunicipio: withServiceHandler(localidades.getByMunicipio, {
    context: 'obtener localidades por municipio',
  }),
};
