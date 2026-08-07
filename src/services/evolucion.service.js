import http from '../http-common';
import { withServiceHandler } from './error-handler';

const evoluciones = {
  async get(personaep_pk) {
    const response = await http.get(`/personas-ep/${personaep_pk}/evoluciones`);
    return response.data;
  },
  async create(data) {
    const response = await http.post(`/evoluciones`, data);
    return response.data;
  },
  async update(id, data) {
    const response = await http.put(`/evoluciones/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/evoluciones/${id}`);
    return response.data;
  },
};

export const evolucionRepository = {
  get: withServiceHandler(evoluciones.get, { context: 'obtener evoluciones' }),
  create: withServiceHandler(evoluciones.create, { context: 'crear evolucion' }),
  update: withServiceHandler(evoluciones.update, { context: 'actualizar evolucion' }),
  delete: withServiceHandler(evoluciones.delete, { context: 'eliminar evolucion' }),
};
