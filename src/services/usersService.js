import http from '../http-common';
import { withServiceHandler } from './errorHandler';

const users = {
  async getUsers() {
    const response = await http.get(`/usuarios`);
    return response.data;
  },
  async updateUser(id, data) {
    const response = await http.put(`/usuarios/${id}`, data);
    return response.data;
  },
  async createUser(data) {
    const response = await http.post(`/usuarios`, data);
    return response.data;
  },
};

export const userRepository = {
  getUsers: withServiceHandler(users.getUsers, { context: 'obtener usuarios' }),
  updateUser: withServiceHandler(users.updateUser, { context: 'actualizar usuario' }),
  createUser: withServiceHandler(users.createUser, { context: 'crear usuario' }),
};
