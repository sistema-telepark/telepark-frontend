import http from '../http-common';
import { withServiceHandler } from './error-handler';

// Encuentro = ClaseTaller: los métodos se llaman *Encuentro* pero contratan
// los endpoints de clase de taller; los ids son idclasetaller.
const encuentros = {
  async getEncuentroAll() {
    const response = await http.get(`/clases-taller`);
    return response.data;
  },
  async getEncuentroGestionAll() {
    const response = await http.get(`/clases-taller`);
    return response.data;
  },
  async createEncuentro(data) {
    const response = await http.post(`/clases-taller`, data);
    return response.data;
  },
  async updateEncuentro(id, data) {
    const response = await http.put(`/clases-taller/${id}`, data);
    return response.data;
  },
  async deleteEncuentro(id) {
    const response = await http.delete(`/clases-taller/${id}`);
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
