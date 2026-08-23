import http from '../http-common';
import { withServiceHandler } from './error-handler';

const pacientes = {
  async guardarPaciente(data) {
    const valorNumerico = (valor) => (valor === '' || valor === undefined ? null : Number(valor));

    let dataDireR = {
      calle: data.calleR,
      departamento: data.departamentoR || null,
      numero: valorNumerico(data.numeroR),
      piso: valorNumerico(data.pisoR),
      idlocalidad: valorNumerico(data.localidadR),
    };
    let dataDireEP = {
      calle: data.calleEP,
      departamento: data.departamentoEP || null,
      numero: valorNumerico(data.numeroEP),
      piso: valorNumerico(data.pisoEP),
      idlocalidad: valorNumerico(data.localidadEP),
    };

    let direccionR = await http.post(`/direcciones`, dataDireR);
    let direccionEP = await http.post(`/direcciones`, dataDireEP);

    let dataPersR = {
      nombre: data.nombreR,
      apellido: data.apellidoR,
      telefono: data.telefonoR,
      iddireccion: direccionR.data.iddireccion,
      borrado: 0,
      espaciente: 0,
    };
    let dataPersEP = {
      nombre: data.nombreEP,
      apellido: data.apellidoEP,
      telefono: data.telefonoEP,
      iddireccion: direccionEP.data.iddireccion,
      borrado: 0,
      espaciente: 1,
    };

    let personaR = await http.post(`/personas`, dataPersR);
    let personaEP = await http.post(`/personas`, dataPersEP);

    let dataPaciente = {
      nombre: data.nombreEP,
      apellido: data.apellidoEP,
      telefono: data.telefonoEP,
      borrado: 0,
      espaciente: 1,

      activataller: 1,
      escolaridadcompleta: 0,
      fechainicio: new Date(),
      fechanacimiento: data.nacimientoEP,
      maximaescolaridadalcanzada: data.escolaridadEP,
      sexo: data.sexoEP,
      tieneacompanante: data.tieneAcompananteEP ? 1 : 0,
      tienecuidador: data.tieneCuidadorEP ? 1 : 0,
      vivesolo: data.viveSoloEP ? 1 : 0,
      ocupacionprevia: data.ocupacionPEP,
      ocupacionactual: data.ocupacionAEP,

      idpersona: personaEP.data.idpersona,
      idreferente: personaR.data.idpersona,
    };

    let paciente = await http.post(`/personas-ep`, dataPaciente);

    return paciente.data;
  },

  async getPacientes() {
    const response = await http.get(`/personas?espaciente=1`);
    return response.data;
  },

  async getPacientesEp() {
    const response = await http.get(`/personas-ep`);
    return response.data;
  },
};

export const pacienteRepository = {
  guardarPaciente: withServiceHandler(pacientes.guardarPaciente, { context: 'guardar paciente' }),
  getPacientes: withServiceHandler(pacientes.getPacientes, { context: 'obtener pacientes' }),
  getPacientesEp: withServiceHandler(pacientes.getPacientesEp, {
    context: 'obtener personas con EP',
  }),
};
