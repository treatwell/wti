export interface Locale {
  name: string;
  code: string;
}

export interface WTIProjectFile {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  hash_file: string;
  master_project_file_id: number | null;
  locale_code: string;
}

export interface WTIProject {
  name: string;
  id: number;
  created_at: string;
  updated_at: string;
  source_locale: Locale;
  target_locales: Locale[];
  project_files: WTIProjectFile[];
}

export interface Statistic {
  generated_at: string;
  stale: boolean;
  count_strings: number;
  count_strings_done: number;
  count_strings_to_proofread: number;
  count_strings_to_translate: number;
  count_strings_hidden: number;
  count_strings_obsolete: number;
  count_strings_to_verify: number;
  wc_count_strings: number;
  wc_count_strings_done: number;
  wc_count_strings_to_proofread: number;
  wc_count_strings_to_translate: number;
  wc_count_strings_to_verify: number;
  wc_count_strings_hidden: number;
  wc_count_strings_obsolete: number;
  char_count_strings: number;
  char_count_strings_done: number;
  char_count_strings_to_proofread: number;
  char_count_strings_to_translate: number;
  char_count_strings_to_verify: number;
  char_count_strings_hidden: number;
  char_count_strings_obsolete: number;
}
