import http from '../http-common';

export const osRepository = {
  //me trae la lista de obra sociales de una persona con ep
  async get(personaep_pk) {
    let response = await http.get(`/personas-ep/${personaep_pk}/coberturas`);

    return response;
  },

  async create(data) {
    let response = await http.post(`/coberturas`, data);

    return response;
  },

  async update(id, data) {
    let response = await http.put(`/coberturas/${id}`, data);

    return response;
  },

  async delete(id) {
    let response = await http.delete(`/coberturas/${id}`);

    return response;
  },
};
