import http from '../http-common';
import { withServiceHandler } from './errorHandler';

const medicamentos = {
  async getAll() {
    const response = await http.get(`/medicamentos`);
    return response.data;
  },
  async create(data) {
    const response = await http.post(`/medicamentos`, data);
    return response.data;
  },
  async update(id, data) {
    const response = await http.put(`/medicamentos/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/medicamentos/${id}`);
    return response.data;
  },
};

export const medicamentoRepository = {
  getAll: withServiceHandler(medicamentos.getAll, { context: 'obtener medicamentos' }),
  create: withServiceHandler(medicamentos.create, { context: 'crear medicamento' }),
  update: withServiceHandler(medicamentos.update, { context: 'actualizar medicamento' }),
  delete: withServiceHandler(medicamentos.delete, { context: 'eliminar medicamento' }),
};
