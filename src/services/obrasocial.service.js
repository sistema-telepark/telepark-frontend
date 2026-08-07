import http from '../http-common';
import { withServiceHandler } from './error-handler';

const obrasociales = {
  async getAll() {
    const response = await http.get(`/obras-sociales`);
    return response.data;
  },
  async create(data) {
    const response = await http.post(`/obras-sociales`, data);
    return response.data;
  },
  async update(id, data) {
    const response = await http.put(`/obras-sociales/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/obras-sociales/${id}`);
    return response.data;
  },
};

export const obrasocialRepository = {
  getAll: withServiceHandler(obrasociales.getAll, { context: 'obtener obras sociales' }),
  create: withServiceHandler(obrasociales.create, { context: 'crear obra social' }),
  update: withServiceHandler(obrasociales.update, { context: 'actualizar obra social' }),
  delete: withServiceHandler(obrasociales.delete, { context: 'eliminar obra social' }),
};
