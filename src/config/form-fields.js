export const basicInfoFormFields = [
  { label: 'Nombre y Apellido', type: 'text', additionalText: '' },
  { label: 'Edad', type: 'number', additionalText: '' },
  { label: 'Curriculum', type: 'upload file', additionalText: ''  },
  { label: 'Reel', type: 'text', additionalText: ''},
  { label: 'Género', type: 'select', additionalText: 'Opciones: Masculino, Femenino, Otro'},
  { label: 'Fecha Nacimiento', type: 'date', icon: 'mdi-calendar' },
  { label: 'País de Residencia', type: 'text' },
  { label: 'Localidad', type: 'text' },
  { label: 'Nacionalidad', type: 'text' },
  { label: 'Teléfono', type: 'text', icon: 'mdi-phone' },
  { label: 'Teléfono 2', type: 'text', icon: 'mdi-phone' },
  { label: 'Instagram', type: 'text', icon: 'mdi-instagram' },
  { label: 'Facebook', type: 'text', icon: 'mdi-facebook' },
  { label: 'Canal Youtube', type: 'text', icon: 'mdi-youtube' },
  { label: 'Página Web', type: 'text', icon: 'mdi-web' },

]

export const galleryShotFormFields = [  
  { label: 'Foto Plano Pecho', type: 'upload file', icon: 'mdi-camera', additionalText: ''  },
  { label: 'Foto Plano General', type: 'upload file', icon: 'mdi-camera', additionalText: ''  },
  { label: 'Foto un Perfil', type: 'upload file', icon: 'mdi-camera', additionalText: ''  },
  { label: 'Foto Adicional 1', type: 'upload file', icon: 'mdi-camera-plus', additionalText: ''  },
  { label: 'Foto Adicional 2', type: 'upload file', icon: 'mdi-camera-plus', additionalText: ''  },
]

export const physicalCharacteristicsFormFields = [
  { label: 'Peso (kg)', type: 'number'},
  { label: 'Altura (cm)', type: 'number' },
  { label: 'Color de Ojos', type: 'select', additionalText: 'Opciones: Verdes, Azules, Celestes, Negros, Marrones', icon:'mdi-eye'},
  { label: 'Color de Piel', type: 'select', additionalText: 'Opciones: Blanca, Moreno, Negra, Amarilla, Albino'},
  { label: 'Medida Cintura', type: 'number' },
  { label: 'Medida Cadera', type: 'number' },
  { label: 'Medida Busto', type: 'number' },
  { label: 'Color de Pelo', type: 'select', additionalText: 'Opciones: Morocho, Castaño, Rubio, Colorado, Teñido - Color Atípico'},
  { label: 'Talle Pantalón', type: 'text', icon:'mdi-hanger' },
  { label: 'Talle Remera', type: 'text', icon:'mdi-hanger' },
  { label: 'Talle Saco', type: 'text', icon:'mdi-hanger' },
  { label: 'Calzado', type: 'text', icon:'mdi-shoe-formal' },
  { label: 'Manos', type: 'select' , icon: 'mdi-hand', additionalText: 'Opciones: Muy Malas, Malas, Regular, etc.'},
  { label: 'Pies', type: 'select' , icon: 'mdi-shoe-print', additionalText: 'Opciones: Muy Malos, Malos, Regular, etc.'},
  { label: 'Dientes', type: 'select' , icon: 'mdi-tooth', additionalText: 'Opciones: Muy Malos, Malos, Regular, etc.'},
  { label: 'Brackets', type: 'select' , additionalText: 'Opciones: Si, No'},
  { label: 'Brackets', type: 'select' , additionalText: 'Opciones: Si, No'},
  { label: 'Tatuajes', type: 'select' , icon: 'mdi-compass-rose', additionalText: 'Opciones: Si, No'},
  { label: 'Zona Tatuajes', type: 'text'},
  { label: 'Piercings', type: 'select' , icon: 'mdi-ear-hearing', additionalText: 'Opciones: Si, No'},
  { label: 'Zona Piercings', type: 'text'},
  { label: 'Aclaraciones', type: 'text area'},
]

export const skillsFormFields = [
  { label: 'Idiomas', type: 'multiple select', icon: 'mdi-book-open-page-variant', additionalText: 'Opciones: Español, Inglés, Francés, etc.'},
  { label: 'Deportes', type: 'multiple select', icon: 'mdi-soccer', additionalText: 'Opciones: Fútbol, Natación, Tennis, Básquet, etc.'},
  { label: 'Instrumentos', type: 'multiple select', icon: 'mdi-guitar-acoustic', additionalText: 'Opciones: Guitarra, Flauta, Piano, etc.'},
  { label: 'Habilidades Extras', type: 'multiple select', icon: 'mdi-star-circle-outline', additionalText: 'Opciones: Neutro, Mimo, Clown, etc.'},
  { label: 'Canto', type: 'select', additionalText: 'Opciones: Si, No.'},
  { label: 'Danza', type: 'select', additionalText: 'Opciones: Si, No.'},
  { label: 'Tipos de Danza', type: 'text'},
  { label: 'Lic. Conducir (Auto)', type: 'select', icon: 'mdi-car', additionalText: 'Opciones: Si, No.' },
  { label: 'Adicionales', type: 'text area', additionalText: 'Permite agregar adicionales como profesión, hobbies, etc.' },
  { label: 'Lic. Conducir (Moto)', type: 'select', icon: 'mdi-motorbike', additionalText: 'Opciones: Si, No.' }
]

export const studiesAndJobsFormFields = [
  { label: 'Experiencias Laborales', type: 'text area'},
  { label: 'Estudios', type: 'text area'}
]