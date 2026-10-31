import http from '../http-common';
import { withServiceHandler } from './error-handler';

const encuentrosTalleres = {
  async getByEncuentro(idEncuentro) {
    const response = await http.get(`/encuentros-talleres?encuentro=${idEncuentro}`);
    return response.data.results ?? response.data;
  },
  async create(data) {
    const response = await http.post(`/encuentros-talleres`, data);
    return response.data;
  },
  async delete(idEncuentroTaller) {
    const response = await http.delete(`/encuentros-talleres/${idEncuentroTaller}`);
    return response.data;
  },
};

export const encuentroTallerRepository = {
  getByEncuentro: withServiceHandler(encuentrosTalleres.getByEncuentro, {
    context: 'obtener talleres del encuentro',
  }),
  create: withServiceHandler(encuentrosTalleres.create, {
    context: 'asociar taller al encuentro',
  }),
  delete: withServiceHandler(encuentrosTalleres.delete, {
    context: 'desasociar taller del encuentro',
  }),
};
