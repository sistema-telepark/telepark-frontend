import http from '../http-common';
import { withServiceHandler } from './error-handler';

const actividadesRealizadas = {
  async getActividadesRealizadasByEncuentro(idEncuentro) {
    const response = await http.get(`/encuentros-talleres-actividades`, {
      params: { encuentro: idEncuentro },
    });
    return response.data.results ?? response.data;
  },
  async getAll() {
    const response = await http.get(`/encuentros-talleres-actividades`);
    return response.data.results ?? response.data;
  },
  async create(data) {
    const response = await http.post(`/encuentros-talleres-actividades`, data);
    return response.data;
  },
  // El path param identifica el registro de encuentro-taller-actividad (M2M).
  async updateActividadRealizada(id, data) {
    const response = await http.put(`/encuentros-talleres-actividades/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/encuentros-talleres-actividades/${id}`);
    return response.data;
  },
};

export const actividadRealizadaRepository = {
  getActividadesRealizadasByEncuentro: withServiceHandler(
    actividadesRealizadas.getActividadesRealizadasByEncuentro,
    {
      context: 'obtener actividades realizadas de un encuentro',
    }
  ),
  getAll: withServiceHandler(actividadesRealizadas.getAll, {
    context: 'obtener actividades realizadas',
  }),
  create: withServiceHandler(actividadesRealizadas.create, {
    context: 'crear actividad realizada',
  }),
  updateActividadRealizada: withServiceHandler(actividadesRealizadas.updateActividadRealizada, {
    context: 'actualizar actividad realizada',
  }),
  delete: withServiceHandler(actividadesRealizadas.delete, {
    context: 'eliminar actividad realizada',
  }),
};
