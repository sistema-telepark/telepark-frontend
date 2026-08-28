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
      fechanacimiento: data.nacimientoEP,
      activataller: 1,
      escolaridadcompleta: 0,
      fechainicio: new Date(),
      maximaescolaridadalcanzada: data.escolaridadEP,
      tieneacompanante: data.tieneAcompananteEP ? 1 : 0,
      tienecuidador: data.tieneCuidadorEP ? 1 : 0,
      vivesolo: data.viveSoloEP ? 1 : 0,
      ocupacionprevia: data.ocupacionPEP,
      ocupacionactual: data.ocupacionAEP,
      direccion: {
        calle: data.calleEP,
        departamento: data.departamentoEP || null,
        numero: valorNumerico(data.numeroEP),
        piso: valorNumerico(data.pisoEP),
        idlocalidad: valorNumerico(data.localidadEP),
      },
      referente: {
        nombre: data.nombreR,
        apellido: data.apellidoR,
        telefono: data.telefonoR,
        sexo: data.sexoR,
        fechanacimiento: data.nacimientoR,
        direccion: {
          calle: data.calleR,
          departamento: data.departamentoR || null,
          numero: valorNumerico(data.numeroR),
          piso: valorNumerico(data.pisoR),
          idlocalidad: valorNumerico(data.localidadR),
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
