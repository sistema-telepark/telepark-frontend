import http from "../http-common";

export const medicamentoRepository = {

    async getAll() {
        let response = await http.get(`/medicamentos`);

        return response;
    },

    async create(data) {
        let response = await http.post(`/medicamentos`, data);

        return response;
    },

    async update(id, data) {
        let response = await http.put(`/medicamentos/${id}`, data);

        return response;
    },

    async delete(id) {
        let response = await http.delete(`/medicamentos/${id}`);

        return response;
    }

};
