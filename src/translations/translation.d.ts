export interface Translation {
  $code: string; // e.g. "en", "en-GB"
  $name: string; // e.g. "English", "Español", "Deutsch"
  $dir: 'ltr' | 'rtl';

  close: string;
  upload: string;
  num_files_selected: (count: number) => string;
  hello_user: (user: string) => string;
}
