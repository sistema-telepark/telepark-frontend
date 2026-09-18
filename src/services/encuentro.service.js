import http from '../http-common';
import { withServiceHandler } from './error-handler';

const encuentros = {
  async getEncuentroAll() {
    const response = await http.get(`/encuentros`);
    return response.data;
  },
  async getEncuentroGestionAll() {
    const response = await http.get(`/encuentros`);
    return response.data;
  },
  async createEncuentro(data) {
    const response = await http.post(`/encuentros`, data);
    return response.data;
  },
  async updateEncuentro(id, data) {
    const response = await http.put(`/encuentros/${id}`, data);
    return response.data;
  },
  async deleteEncuentro(id) {
    const response = await http.delete(`/encuentros/${id}`);
    return response.data;
  },
};

export const encuentroRepository = {
  getEncuentroAll: withServiceHandler(encuentros.getEncuentroAll, {
    context: 'obtener encuentros',
  }),
  getEncuentroGestionAll: withServiceHandler(encuentros.getEncuentroGestionAll, {
    context: 'obtener encuentros para gestión',
  }),
  createEncuentro: withServiceHandler(encuentros.createEncuentro, { context: 'crear encuentro' }),
  updateEncuentro: withServiceHandler(encuentros.updateEncuentro, {
    context: 'actualizar encuentro',
  }),
  deleteEncuentro: withServiceHandler(encuentros.deleteEncuentro, {
    context: 'eliminar encuentro',
  }),
};
