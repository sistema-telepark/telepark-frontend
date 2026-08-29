import http from '../http-common';
import { withServiceHandler } from './error-handler';

const actividadesRealizadas = {
  // El backend no expone /actividadrealizada/{id}/actividades; se recorre la
  // paginación de /actividades-realizadas (envelope DRF {count,next,results})
  // y se filtra client-side por idclasetaller.
  async getActividadesRealizadasByClase(idClaseTaller) {
    const resultados = [];
    let nextUrl = `/actividades-realizadas`;
    while (nextUrl) {
      const response = await http.get(nextUrl);
      const { count, next, results } = response.data;
      resultados.push(...results);
      if (resultados.length >= count) break; // guard: cortar al cubrir count
      nextUrl = next; // URL absoluta del envelope; axios la usa tal cual
    }
    return resultados.filter((item) => Number(item.idclasetaller) === Number(idClaseTaller));
  },
  async getAll() {
    const response = await http.get(`/actividades-realizadas`);
    return response.data;
  },
  async create(data) {
    const response = await http.post(`/actividades-realizadas`, data);
    return response.data;
  },
  // El path param se llama idactividad pero identifica el registro de
  // actividad realizada (M2M).
  async updateActividadRealizada(id, data) {
    const response = await http.put(`/actividades-realizadas/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/actividades-realizadas/${id}`);
    return response.data;
  },
};

export const actividadRealizadaRepository = {
  getActividadesRealizadasByClase: withServiceHandler(
    actividadesRealizadas.getActividadesRealizadasByClase,
    {
      context: 'obtener actividades de una clase',
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
