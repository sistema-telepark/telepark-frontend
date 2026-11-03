import http from '../http-common';
import { withServiceHandler } from './error-handler';

const REPORTE_FALTAS_PATH = '/reportes/faltas-consecutivas';

const reportes = {
  async getFaltasConsecutivas() {
    const response = await http.get(REPORTE_FALTAS_PATH);
    return response.data.results ?? response.data;
  },
};

export const reporteRepository = {
  getFaltasConsecutivas: withServiceHandler(reportes.getFaltasConsecutivas, {
    context: 'obtener faltas consecutivas',
  }),
};
