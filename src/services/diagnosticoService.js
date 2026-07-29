import http from '../http-common';

export const diagnosticoRepository = {
  //me trae los diagnosticos de una persona con ep
  async get(personaep_pk) {
    let response = await http.get(`/personas-ep/${personaep_pk}/diagnosticos`);

    return response;
  },

  async create(data) {
    let response = await http.post(`/diagnosticos`, data);

    return response;
  },

  async update(id, data) {
    let response = await http.put(`/diagnosticos/${id}`, data);

    return response;
  },

  async delete(id) {
    let response = await http.delete(`/diagnosticos/${id}`);

    return response;
  },
};
