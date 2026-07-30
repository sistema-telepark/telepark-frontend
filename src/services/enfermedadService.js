import http from '../http-common';
import { withServiceHandler } from './errorHandler';

const enfermedades = {
  async getAll() {
    const response = await http.get(`/enfermedades`);
    return response.data;
  },
  async create(data) {
    const response = await http.post(`/enfermedades`, data);
    return response.data;
  },
  async update(id, data) {
    const response = await http.put(`/enfermedades/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/enfermedades/${id}`);
    return response.data;
  },
};

export const enfermedadRepository = {
  getAll: withServiceHandler(enfermedades.getAll, { context: 'obtener enfermedades' }),
  create: withServiceHandler(enfermedades.create, { context: 'crear enfermedad' }),
  update: withServiceHandler(enfermedades.update, { context: 'actualizar enfermedad' }),
  delete: withServiceHandler(enfermedades.delete, { context: 'eliminar enfermedad' }),
};
