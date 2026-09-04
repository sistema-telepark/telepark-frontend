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
      activataller: true,
      escolaridadcompleta: false,
      fechainicio: new Date(),
      maximaescolaridadalcanzada: data.escolaridadEP,
      tieneacompanante: data.tieneAcompananteEP ? true : false,
      tienecuidador: data.tieneCuidadorEP ? true : false,
      vivesolo: data.viveSoloEP ? true : false,
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
