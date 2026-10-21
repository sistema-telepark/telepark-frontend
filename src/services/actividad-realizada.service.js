import http from '../http-common';
import { withServiceHandler } from './error-handler';

const actividadesRealizadas = {
  // El backend no expone /encuentroactividad/{id}/actividades; se recorre la
  // paginación de /encuentros-actividades (envelope DRF {count,next,results})
  // y se filtra client-side por encuentro.
  async getActividadesRealizadasByClase(idEncuentro) {
    const resultados = [];
    let nextUrl = `/encuentros-actividades`;
    while (nextUrl) {
      const response = await http.get(nextUrl);
      const data = response.data;
      const items = Array.isArray(data) ? data : (data.results ?? []);
      resultados.push(...items);
      if (Array.isArray(data) || resultados.length >= data.count) break;
      nextUrl = data.next;
    }
    return resultados.filter((item) => Number(item.encuentro) === Number(idEncuentro));
  },
  async getAll() {
    const response = await http.get(`/encuentros-actividades`);
    return response.data.results ?? response.data;
  },
  async create(data) {
    const response = await http.post(`/encuentros-actividades`, data);
    return response.data;
  },
  // El path param identifica el registro de encuentro-actividad (M2M).
  async updateActividadRealizada(id, data) {
    const response = await http.put(`/encuentros-actividades/${id}`, data);
    return response.data;
  },
  async delete(id) {
    const response = await http.delete(`/encuentros-actividades/${id}`);
    return response.data;
  },
};

export const actividadRealizadaRepository = {
  getActividadesRealizadasByClase: withServiceHandler(
    actividadesRealizadas.getActividadesRealizadasByClase,
    {
      context: 'obtener actividades de un encuentro',
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
