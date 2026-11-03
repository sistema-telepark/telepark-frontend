import http from '../http-common';
import { withServiceHandler } from './error-handler';

const ASISTENCIA_PATH = '/asistencias-taller';

const asistencias = {
  async createAsistencia(data) {
    if (Array.isArray(data)) {
      const responses = await Promise.all(data.map((item) => http.post(ASISTENCIA_PATH, item)));
      return responses.map((response) => response.data);
    }
    const response = await http.post(ASISTENCIA_PATH, data);
    return response.data;
  },
  async updateAsistencia(id, data) {
    const response = await http.put(`${ASISTENCIA_PATH}/${id}`, data);
    return response.data;
  },
  async deleteAsistencia(id) {
    const response = await http.delete(`${ASISTENCIA_PATH}/${id}`);
    return response.data;
  },
  async getRosterEncuentro(idEncuentro) {
    const response = await http.get(`/encuentros/${Number(idEncuentro)}/asistencias`);
    return response.data.results ?? response.data;
  },
};

export const asistenciaRepository = {
  createAsistencia: withServiceHandler(asistencias.createAsistencia, {
    context: 'guardar asistencia',
  }),
  updateAsistencia: withServiceHandler(asistencias.updateAsistencia, {
    context: 'actualizar asistencia',
  }),
  deleteAsistencia: withServiceHandler(asistencias.deleteAsistencia, {
    context: 'eliminar asistencia',
  }),
  getRosterEncuentro: withServiceHandler(asistencias.getRosterEncuentro, {
    context: 'obtener roster del encuentro',
  }),
};
