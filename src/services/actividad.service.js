import http from '../http-common';
import { withServiceHandler } from './error-handler';

const actividades = {
  async getAll() {
    const response = await http.get(`/actividades`);
    return response.data;
  },
  async create(data) {
    const response = await http.post(`/actividades`, data);
    return response.data;
  },
  async update(id, data) {
    const response = await http.put(`/actividades/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/actividades/${id}`);
    return response.data;
  },
};

export const actividadRepository = {
  getAll: withServiceHandler(actividades.getAll, { context: 'obtener actividades' }),
  create: withServiceHandler(actividades.create, { context: 'crear actividad' }),
  update: withServiceHandler(actividades.update, { context: 'actualizar actividad' }),
  delete: withServiceHandler(actividades.delete, { context: 'eliminar actividad' }),
};
