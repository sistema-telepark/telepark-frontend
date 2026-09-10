import { showAlert, showConfirm, showToast } from '../services/notification.service';

class Utils {
  convertirFormatoFecha(string) {
    var info = string.split('-');
    return info[2] + '/' + info[1] + '/' + info[0];
  }

  convertirFormatoHora(string) {
    var info = string.split(':');
    return info[0] + ':' + info[1];
  }

  convertirEstado(estado) {
    if (estado === true) {
      return 'Vigente';
    } else {
      return 'Caducado';
    }
  }

  convertirTipo(tipo) {
    if (tipo === true) {
      return 'Publica';
    } else {
      return 'Privada';
    }
  }

  convertirEstatal(opcion) {
    if (opcion === '0') {
      return false;
    } else {
      return true;
    }
  }

  convertRole(role) {
    if (role === true || role === 'true') {
      return 'Administrador';
    }
    return 'Usuario';
  }

  convertStateUser(state) {
    if (state === true) {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

  describirEstado(estado) {
    switch (estado) {
      case 0:
        return 'Ausencia de signos patológicos.';
      case 1:
        return 'Los síntomas parkinsonianos afectan sólo a un lado del cuerpo.';
      case 2:
        return 'Afectación de los dos lados del cuerpo sin transtorno del equilibrio.';
      case 3:
        return 'Alteración bilateral leve o moderada, con cierta inestabilidad postural. El paciente es fisicamente independiente.';
      case 4:
        return 'Incapacidad grave: es capaz de caminar o de permanecer de pié sin ayuda.';
      case 5:
        return 'El paciente necesita ayuda para todo. Permanece en cama o sentado.';
      default:
        return '';
    }
  }

  fechaActual() {
    const fecha = new Date();
    const dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    if (mes < 10) {
      mes = '0' + mes;
    }
    return anio + '-' + mes + '-' + dia;
  }

  notificacionGuardar() {
    showToast('success', 'Se ha guardado con éxito');
  }

  notificacionEliminar(info, id, funcion) {
    showConfirm({
      title: 'Estas seguro?',
      message: 'No podrás revertir esto!',
      confirmLabel: 'Si!',
      cancelLabel: 'No',
      variant: 'warning',
    }).then((confirmed) => {
      if (confirmed) {
        funcion(info, id);
      } else {
        showAlert('danger', 'Cancelado', 'No se eliminaron registros');
      }
    });
  }

  notificacionError() {
    showToast('danger', 'Hubo un error en la solicitud');
  }

  send() {
    showAlert('success', 'Formulario enviado con éxito!', undefined, { autoHideMs: 1500 });
  }

  errorSend() {
    showAlert('danger', 'Hubo un error al enviar el formulario!', 'Intentelo mas tarde.');
  }
}

const utils = new Utils();
export default utils;
