import http from '../http-common';

export const direccionRepository = {
  async create(data) {
    let response = await http.post(`/direcciones`, data);

    return response;
  },
};
