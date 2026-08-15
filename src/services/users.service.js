import http from '../http-common';
import { withServiceHandler } from './error-handler';

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
  async deleteUser(id) {
    const response = await http.delete(`/usuarios/${id}`);
    return response.data;
  },
};

export const userRepository = {
  getUsers: withServiceHandler(users.getUsers, { context: 'obtener usuarios' }),
  updateUser: withServiceHandler(users.updateUser, { context: 'actualizar usuario' }),
  createUser: withServiceHandler(users.createUser, { context: 'crear usuario' }),
  deleteUser: withServiceHandler(users.deleteUser, { context: 'eliminar usuario' }),
};
