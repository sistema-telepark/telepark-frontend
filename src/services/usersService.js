import http from "../http-common";

export const userRepository = {
  async getUsers() {
    let response = await http.get(`/usuarios`);

    return response;
  },

  async updateUser(id, data) {
    let response = await http.put(`/usuarios/${id}`, data);

    return response;
  },

  async createUser(data) {
    let response = await http.post(`/usuarios`, data);

    return response;
  }

};
