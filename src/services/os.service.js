import http from '../http-common';
import { withServiceHandler } from './error-handler';

const os = {
  async get(personaep_pk) {
    try {
      const response = await http.get(`/personas-ep/${personaep_pk}/coberturas`);
      return response.data.results ?? response.data;
    } catch (error) {
      // Sprint 5.24 (DR-1 Opción A): 404 {code:"not_found"} de sub-recurso de PersonaEp
      // se traduce a lista vacía silenciosa (sin propagar error al componente).
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },
  async create(data) {
    const response = await http.post(`/coberturas`, data);
    return response.data;
  },
  async update(id, data) {
    const response = await http.put(`/coberturas/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/coberturas/${id}`);
    return response.data;
  },
};

export const osRepository = {
  get: withServiceHandler(os.get, { context: 'obtener coberturas' }),
  create: withServiceHandler(os.create, { context: 'crear cobertura' }),
  update: withServiceHandler(os.update, { context: 'actualizar cobertura' }),
  delete: withServiceHandler(os.delete, { context: 'eliminar cobertura' }),
};
