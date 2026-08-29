import http from '../http-common';
import { withServiceHandler } from './error-handler';

const indicaciones = {
  async get(personaep_pk) {
    try {
      const response = await http.get(`/personas-ep/${personaep_pk}/indicaciones`);
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
    const response = await http.post(`/indicaciones`, data);
    return response.data;
  },
  async update(id, data) {
    const response = await http.put(`/indicaciones/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/indicaciones/${id}`);
    return response.data;
  },
};

export const indicacionRepository = {
  get: withServiceHandler(indicaciones.get, { context: 'obtener indicaciones' }),
  create: withServiceHandler(indicaciones.create, { context: 'crear indicacion' }),
  update: withServiceHandler(indicaciones.update, { context: 'actualizar indicacion' }),
  delete: withServiceHandler(indicaciones.delete, { context: 'eliminar indicacion' }),
};
