import http from '../http-common';
import { withServiceHandler } from './errorHandler';

const direcciones = {
  async create(data) {
    const response = await http.post(`/direcciones`, data);
    return response.data;
  },
};

export const direccionRepository = {
  create: withServiceHandler(direcciones.create, { context: 'crear direccion' }),
};
