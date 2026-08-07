import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

const Modal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success margenbutton',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
})

export const showToast = (icon, title, options = {}) => {
  Toast.fire({ icon, title, ...options })
}

export const showModal = (icon, title, text, options = {}) => {
  Modal.fire({
    icon,
    title,
    text,
    showConfirmButton: true,
    ...options,
  })
}

export const showConfirm = async (title, text, options = {}) => {
  const result = await Modal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    ...options,
  })
  return result.isConfirmed
}

export const showLoading = (title = 'Procesando...', html) => {
  Swal.fire({
    title,
    html,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  })
}

export const closeLoading = () => Swal.close()
