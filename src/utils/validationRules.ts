export const nameRules = [
  (value) => !!value || 'Debe colocar el nombre',
  (value) => (value && value.length >= 5) || 'El nombre debe contener más de 5 caracteres',
]

export const emailRules = [
  (value) => !!value || 'Ingrese su E-mail',
  (value) => /.+@.+\..+/.test(value) || 'El E-mail ingresado no es correcto',
]

export const passwordRules = [
  (value) => !!value || 'Debe ingresar su contraseña',
  (value) => (value && value.length >= 5) || 'La contraseña debe contener más de 5 caracteres',
]
