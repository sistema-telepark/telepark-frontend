import http from '../http-common';

export const evolucionRepository = {
  //me trae las evoluciones de una persona con ep
  async get(personaep_pk) {
    let response = await http.get(`/personas-ep/${personaep_pk}/evoluciones`);

    return response;
  },

  async create(data) {
    let response = await http.post(`/evoluciones`, data);

    return response;
  },

  async update(id, data) {
    let response = await http.put(`/evoluciones/${id}`, data);

    return response;
  },

  async delete(id) {
    let response = await http.delete(`/evoluciones/${id}`);

    return response;
  },
};
