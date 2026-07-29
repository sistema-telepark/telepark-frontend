import http from '../http-common';

export const municipioRepository = {
  async getAll() {
    let response = await http.get(`/municipios`);

    return response;
  },
};
