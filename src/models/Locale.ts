import FormData from 'form-data';

import { wtiPost, WtiErrorResponse, wtiDelete } from '../helpers';

export class Locale {
  private _locale: string;
  private _suffixCode: string;
  private _suffixDescription: string;

  constructor(locale: string, suffixCode?: string, suffixDescription?: string) {
    this._locale = locale;
    this._suffixCode = suffixCode || '';
    this._suffixDescription = suffixDescription || '';
  }

  async create() {
    try {
      const formData = new FormData();
      formData.append('id', this._locale);
      formData.append('suffix_code', this._suffixCode);
      formData.append('suffix_description', this._suffixDescription);

      const response = await wtiPost('/locales', formData);

      if (response.status !== 202) {
        const parsedResponse = (await response.json()) as WtiErrorResponse;

        return Promise.reject(parsedResponse.error);
      }

      return Promise.resolve();
    } catch (err) {
      console.error(String(err));
      process.exit(1);
    }
  }

  async remove() {
    try {
      // return 202 if success with empty body
      // return 404 with WtiErrorResponse if file not found
      const response = await wtiDelete(`/locales/${this._locale}`);

      if (response.status !== 202) {
        const parsedResponse = (await response.json()) as WtiErrorResponse;

        return Promise.reject(parsedResponse.error);
      }

      return Promise.resolve();
    } catch (err) {
      console.error(String(err));
      process.exit(1);
    }
  }
}
