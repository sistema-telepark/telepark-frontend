import http from '../http-common';
import { withServiceHandler } from './errorHandler';

const events = {
  // service tipo de evento
  async getEventAll() {
    const response = await http.get(`/tipos-evento`);
    return response.data;
  },
  async updateTypeEvent(id, data) {
    const response = await http.put(`/tipos-evento/${id}`, data);
    return response.data;
  },
  async createTypeEvent(data) {
    const response = await http.post(`/tipos-evento`, data);
    return response.data;
  },
  async deleteTypeEvent(id) {
    const response = await http.delete(`/tipos-evento/${id}`);
    return response.data;
  },
  // service de evento
  async createEvent(data) {
    const response = await http.post(`/eventos`, data);
    return response.data;
  },
  async getEventGestionAll() {
    const response = await http.get(`/eventos`);
    return response.data;
  },
  // service de persona
  async getAll() {
    const response = await http.get(`/personas`);
    return response.data;
  },
  async getPersonAll() {
    const response = await http.get(`/personas?espaciente=1`);
    return response.data;
  },
  async updatePerson(id, data) {
    const response = await http.put(`/personas/${id}`, data);
    return response.data;
  },
  async deletePerson(id) {
    const response = await http.delete(`/personas/${id}`);
    return response.data;
  },
};

export const eventRespository = {
  getEventAll: withServiceHandler(events.getEventAll, { context: 'obtener tipos de evento' }),
  updateTypeEvent: withServiceHandler(events.updateTypeEvent, { context: 'actualizar tipo de evento' }),
  createTypeEvent: withServiceHandler(events.createTypeEvent, { context: 'crear tipo de evento' }),
  deleteTypeEvent: withServiceHandler(events.deleteTypeEvent, { context: 'eliminar tipo de evento' }),
  createEvent: withServiceHandler(events.createEvent, { context: 'crear evento' }),
  getEventGestionAll: withServiceHandler(events.getEventGestionAll, { context: 'obtener eventos' }),
  getAll: withServiceHandler(events.getAll, { context: 'obtener personas' }),
  getPersonAll: withServiceHandler(events.getPersonAll, { context: 'obtener pacientes' }),
  updatePerson: withServiceHandler(events.updatePerson, { context: 'actualizar persona' }),
  deletePerson: withServiceHandler(events.deletePerson, { context: 'eliminar persona' }),
};
