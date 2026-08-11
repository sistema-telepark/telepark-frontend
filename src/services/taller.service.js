import http from '../http-common';
import { withServiceHandler } from './error-handler';

const talleres = {
  async getTallerAll() {
    const response = await http.get(`/talleres`);
    return response.data;
  },
  async createTaller(data) {
    const response = await http.post(`/talleres`, data);
    return response.data;
  },
  async updateTaller(id, data) {
    const response = await http.put(`/talleres/${id}`, data);
    return response.data;
  },
  async deleteTaller(id) {
    const response = await http.delete(`/talleres/${id}`);
    return response.data;
  },
};

export const tallerRepository = {
  getTallerAll: withServiceHandler(talleres.getTallerAll, { context: 'obtener talleres' }),
  createTaller: withServiceHandler(talleres.createTaller, { context: 'crear taller' }),
  updateTaller: withServiceHandler(talleres.updateTaller, { context: 'actualizar taller' }),
  deleteTaller: withServiceHandler(talleres.deleteTaller, { context: 'eliminar taller' }),
};
