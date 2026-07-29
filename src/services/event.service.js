import http from '../http-common';

export const eventRespository = {
  // service tipo de evento
  async getEventAll() {
    let response = await http.get(`/tipos-evento`);

    return response;
  },
  async updateTypeEvent(id, data) {
    let response = await http.put(`/tipos-evento/${id}`, data);

    return response;
  },

  async createTypeEvent(data) {
    let response = await http.post(`/tipos-evento`, data);

    return response;
  },

  async deleteTypeEvent(id) {
    return await http.delete(`/tipos-evento/${id}`);
  },

  // service de evento
  async createEvent(data) {
    let response = await http.post(`/eventos`, data);

    return response;
  },

  async getEventGestionAll() {
    let response = await http.get(`/eventos`);

    return response;
  },
  // service de persona
  async getAll() {
    let response = await http.get(`/personas`);
    return response;
  },
  async getPersonAll() {
    let response = await http.get(`/personas?espaciente=1`);
    return response;
  },
  async updatePerson(id, data) {
    let response = await http.put(`/personas/${id}`, data);
    return response;
  },
  async deletePerson(id) {
    return await http.delete(`/personas/${id}`);
  },
};
