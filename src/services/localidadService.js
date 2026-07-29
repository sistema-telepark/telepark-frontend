import http from '../http-common';

export const localidadRepository = {
  async getAll() {
    let response = await http.get(`/localidades`);

    return response;
  },
};
