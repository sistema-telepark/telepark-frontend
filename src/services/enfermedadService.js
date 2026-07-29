import http from '../http-common';

export const enfermedadRepository = {
  async getAll() {
    let response = await http.get(`/enfermedades`);

    return response;
  },

  async create(data) {
    let response = await http.post(`/enfermedades`, data);

    return response;
  },

  async update(id, data) {
    let response = await http.put(`/enfermedades/${id}`, data);

    return response;
  },

  async delete(id) {
    let response = await http.delete(`/enfermedades/${id}`);

    return response;
  },
};
