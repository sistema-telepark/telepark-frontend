import http from "../http-common";

export const indicacionRepository = {

    //me trae la lista de indicaciones de una persona con ep
    async get(personaep_pk) {
        let response = await http.get(`/personas-ep/${personaep_pk}/indicaciones`);

        return response;
    },

    async create(data) {
        let response = await http.post(`/indicaciones`, data);

        return response;
    },

    async update(id, data) {
        let response = await http.put(`/indicaciones/${id}`, data);

        return response;
    },

    async delete(id) {
        let response = await http.delete(`/indicaciones/${id}`);

        return response;
    }

};
