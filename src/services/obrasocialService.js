import http from "../http-common";

export const obrasocialRepository = {

    async getAll() {
        let response = await http.get(`/obras-sociales`);

        return response;
    },

    async create(data) {
        let response = await http.post(`/obras-sociales`, data);

        return response;
    },

    async update(id, data) {
        let response = await http.put(`/obras-sociales/${id}`, data);

        return response;
    },

    async delete(id) {
        let response = await http.delete(`/obras-sociales/${id}`);

        return response;
    }

};
