import http from '../http-common';
import { withServiceHandler } from './error-handler';

const diagnosticos = {
  async get(personaep_pk) {
    try {
      const response = await http.get(`/personas-ep/${personaep_pk}/diagnosticos`);
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
    const response = await http.post(`/diagnosticos`, data);
    return response.data;
  },
  async update(id, data) {
    const response = await http.put(`/diagnosticos/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/diagnosticos/${id}`);
    return response.data;
  },
};

export const diagnosticoRepository = {
  get: withServiceHandler(diagnosticos.get, { context: 'obtener diagnosticos' }),
  create: withServiceHandler(diagnosticos.create, { context: 'crear diagnostico' }),
  update: withServiceHandler(diagnosticos.update, { context: 'actualizar diagnostico' }),
  delete: withServiceHandler(diagnosticos.delete, { context: 'eliminar diagnostico' }),
};
