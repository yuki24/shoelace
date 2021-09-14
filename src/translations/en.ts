import type { Translation } from './translation';

const translation: Translation = {
  // Metadata
  $code: 'en',
  $name: 'English',
  $dir: 'ltr',

  // Terms
  close: 'Close',
  upload: 'Upload',

  hello_user: user => `Hello, ${user}`,

  num_files_selected: count => {
    if (count === 0) return `No files selected`;
    if (count === 1) return `1 file selected`;
    return `${count} files selected`;
  }
};

export default translation;
