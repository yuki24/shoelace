import { registerTranslation } from '../utilities/localize';
import type { Translation } from './translation';

const translation: Translation = {
  // Metadata
  $code: 'es',
  $name: 'Español',
  $dir: 'ltr',

  // Terms
  close: 'Cerrar',
  upload: 'Subir',
  num_files_selected: count => {
    if (count === 0) return `No se seleccionaron archivos`;
    if (count === 1) return `1 archivo seleccionado`;
    return `${count} archivos seleccionados`;
  },
  hello_user: user => `Hola, ${user}`
};

registerTranslation(translation);

export default translation;
