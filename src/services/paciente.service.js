import http from '../http-common';
import { withServiceHandler } from './error-handler';

const pacientes = {
  async guardarPaciente(data) {
    const valorNumerico = (valor) => (valor === '' || valor === undefined ? null : Number(valor));

    const payload = {
      nombre: data.nombreEP,
      apellido: data.apellidoEP,
      telefono: data.telefonoEP,
      sexo: data.sexoEP,
      fecha_nacimiento: data.nacimientoEP,
      activa_taller: true,
      escolaridad_completa: false,
      fecha_inicio: new Date(),
      maxima_escolaridad_alcanzada: data.escolaridadEP,
      tiene_acompanante: data.tieneAcompananteEP ? true : false,
      tiene_cuidador: data.tieneCuidadorEP ? true : false,
      vive_solo: data.viveSoloEP ? true : false,
      ocupacion_previa: data.ocupacionPEP,
      ocupacion_actual: data.ocupacionAEP,
      direccion: {
        calle: data.calleEP,
        departamento: data.deptoEdificioEP || null,
        numero: valorNumerico(data.numeroEP),
        piso: valorNumerico(data.pisoEP),
        localidad: valorNumerico(data.localidadEP),
      },
      referente: {
        nombre: data.nombreR,
        apellido: data.apellidoR,
        telefono: data.telefonoR,
        sexo: data.sexoR,
        fecha_nacimiento: data.nacimientoR,
        direccion: {
          calle: data.calleR,
          departamento: data.deptoEdificioR || null,
          numero: valorNumerico(data.numeroR),
          piso: valorNumerico(data.pisoR),
          localidad: valorNumerico(data.localidadR),
        },
      },
    };

    const paciente = await http.post(`/personas-ep`, payload);
    return paciente.data;
  },

  async getPacientesEp() {
    const response = await http.get(`/personas-ep`);
    return response.data;
  },
};

export const pacienteRepository = {
  guardarPaciente: withServiceHandler(pacientes.guardarPaciente, { context: 'guardar paciente' }),
  getPacientesEp: withServiceHandler(pacientes.getPacientesEp, {
    context: 'obtener personas con EP',
  }),
};
