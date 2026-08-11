import http from '../http-common';
import { withServiceHandler } from './error-handler';

// D-H4 RESUELTA (PO, 2026-08-10 — Opción C): default según Telepark API.yaml:332
const ASISTENCIA_PATH = '/asistencias-taller';

const asistencias = {
  async getAsistenciaAll() {
    const response = await http.get(ASISTENCIA_PATH);
    return response.data;
  },
  // RA-14: bulk — el componente asistencia-taller.js envía un array; 1 POST por
  // item (el YAML:354 documenta body UNO AsistenciaTaller). Sin rollback (S12).
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
  // RA-13: el YAML NO expone /asistenciataller/encuentro/{id}; se recorre la
  // paginación de /asistencias-taller (envelope DRF, Telepark API.yaml:4853) y
  // se filtra client-side por idclasetaller (el id del encuentro = idclasetaller).
  async getAsistenciaByEncuentro(idClaseTaller) {
    const resultados = [];
    let nextUrl = ASISTENCIA_PATH;
    while (nextUrl) {
      const response = await http.get(nextUrl);
      const { count, next, results } = response.data;
      resultados.push(...results);
      if (resultados.length >= count) break; // guard: cortar al cubrir count
      nextUrl = next; // URL absoluta del envelope; axios la usa tal cual
    }
    return resultados.filter((item) => Number(item.idclasetaller) === Number(idClaseTaller));
  },
};

export const asistenciaRepository = {
  getAsistenciaAll: withServiceHandler(asistencias.getAsistenciaAll, {
    context: 'obtener asistencias',
  }),
  createAsistencia: withServiceHandler(asistencias.createAsistencia, {
    context: 'guardar asistencia',
  }),
  updateAsistencia: withServiceHandler(asistencias.updateAsistencia, {
    context: 'actualizar asistencia',
  }),
  deleteAsistencia: withServiceHandler(asistencias.deleteAsistencia, {
    context: 'eliminar asistencia',
  }),
  getAsistenciaByEncuentro: withServiceHandler(asistencias.getAsistenciaByEncuentro, {
    context: 'obtener asistencia por clase',
  }),
};
