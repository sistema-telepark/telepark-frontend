import Swal from 'sweetalert2';

class Utils {
  retornarProvincias() {
    const arrayProvincias = [
      { id: 1, provincia: 'Buenos Aires' },
      { id: 2, provincia: 'Catamarca' },
      { id: 3, provincia: 'Chaco' },
      { id: 4, provincia: 'Chubut' },
      { id: 5, provincia: 'Córdoba' },
      { id: 6, provincia: 'Corrientes' },
      { id: 7, provincia: 'Entre Ríos' },
      { id: 8, provincia: 'Formosa' },
      { id: 9, provincia: 'Jujuy' },
      { id: 10, provincia: 'La Pampa' },
      { id: 11, provincia: 'La Rioja' },
      { id: 12, provincia: 'Mendoza' },
      { id: 13, provincia: 'Misiones' },
      { id: 14, provincia: 'Neuquén' },
      { id: 15, provincia: 'Río Negro' },
      { id: 16, provincia: 'Salta' },
      { id: 17, provincia: 'San Juan' },
      { id: 18, provincia: 'San Luis' },
      { id: 19, provincia: 'Santa Cruz' },
      { id: 20, provincia: 'Santa Fe' },
      { id: 21, provincia: 'Santiago del Estero' },
      { id: 22, provincia: 'Tierra del Fuego' },
      { id: 23, provincia: 'Tucumán' },
    ];
    return arrayProvincias;
  }

  convertirFormatoFecha(string) {
    var info = string.split('-');
    return info[2] + '/' + info[1] + '/' + info[0];
  }

  convertirFormatoHora(string) {
    var info = string.split(':');
    return info[0] + ':' + info[1];
  }

  convertirEstado(estado) {
    if (estado === 1) {
      return 'Vigente';
    } else {
      return 'Caducado';
    }
  }

  convertirTipo(tipo) {
    if (tipo === 1) {
      return 'Publica';
    } else {
      return 'Privada';
    }
  }

  convertirCheck(opcion) {
    if (opcion === false) {
      return 0;
    } else {
      return 1;
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
    if (role === true) {
      return 'Administrador';
    } else {
      return 'Usuario';
    }
  }

  convertStateUser(state) {
    if (state === true) {
      return 'Activo';
    } else {
      return 'Inactivo';
    }
  }

  // Funcion que retorna la descripcion segun el estado de evolucion
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

  // Notificaciones
  notificacionGuardar() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Se ha guardado con éxito',
    });
  }

  notificacionEliminar(info, id, funcion) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success margenbutton',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Estas seguro?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si!',
        cancelButtonText: 'No',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          funcion(info, id);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire('Cancelado', 'No se eliminaron registros', 'error');
        }
      });
  }

  notificacionError() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'error',
      title: 'Hubo un error en la solicitud',
    });
  }

  send() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Formulario enviado con éxito!',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  errorSend() {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Hubo un error al enviar el formulario!',
      text: 'Intentelo mas tarde.',
      confirmButtonText: 'OK',
    });
  }
}

export default new Utils();
