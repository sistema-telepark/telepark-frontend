import http from '../http-common';

export const pacienteRepository = {
  async guardarPaciente(data) {
    let dataDireR = {
      calle: data.calleR,
      departamento: 'A',
      numero: data.numeroR,
      piso: data.pisoR,
      idlocalidad: '',
    };
    let dataDireEP = {
      calle: data.calleEP,
      departamento: 'A',
      numero: data.numeroEP,
      piso: data.pisoEP,
      idlocalidad: '',
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

    console.log(dataPersEP);

    let personaR = await http.post(`/personas`, dataPersR);
    let personaEP = await http.post(`/personas`, dataPersEP);

    let dataPaciente = {
      activataller: '1',
      escolaridadcompleta: '0',
      fechainicio: new Date(),
      fechanacimiento: data.nacimientoEP,
      maximaescolaridadalcanzada: data.escolaridadEP,
      sexo: data.sexoEP,
      tieneacompanante: '1',
      tienecuidador: '0',
      vivesolo: '1',
      ocupacionprevia: data.ocupacionPEP,
      ocupacionactual: data.ocupacionAEP,
      idpersona: personaEP.data.idpersona,
      idreferente: personaR.data.idpersona,
    };

    console.log(dataPaciente);

    let paciente = await http.post(`/personas-ep`, dataPaciente);

    return paciente;
  },

  async getPacientes() {
    let response = await http.get(`/personas?espaciente=1`);

    return response;
  },
};
