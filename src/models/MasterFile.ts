import fs from 'fs';
import FormData from 'form-data';

import { MasterFileAlreadyExistsError } from '../errors';
import {
  wtiPost,
  wtiPut,
  wtiDelete,
  wtiGet,
  WtiErrorResponse,
} from '../helpers';
import { WTIProjectFile } from './types';

type Translations = {
  [key: string]: string;
};

const writeTranslations = (path: fs.PathLike, data: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

export class MasterFile {
  private _masterFileId: number;

  private static instance: MasterFile;

  constructor(masterFileId: number) {
    this._masterFileId = masterFileId;
  }

  public static async create(name: string) {
    try {
      const file = fs.createReadStream(process.cwd() + `/${name}`);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      const response = await wtiPost('/files', formData);
      const fileId = await response.text();

      if (fileId) {
        MasterFile.instance = new MasterFile(Number(fileId));

        return MasterFile.instance;
      } else {
        throw new MasterFileAlreadyExistsError();
      }
    } catch (err) {
      console.error(String(err));
      process.exit(1);
    }
  }

  async show(file: WTIProjectFile) {
    try {
      const response = await wtiGet(
        `/files/${this._masterFileId}/locales/${file.locale_code}`
      );

      const result = (await response.json()) as Translations;

      const data: Translations = {};

      Object.keys(result)
        .sort()
        .forEach(function (key) {
          data[key] = result[key] === null ? '' : result[key];
        });

      await writeTranslations(file.name, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(String(err));
      process.exit(1);
    }
  }

  async update(name: string, locale: string) {
    try {
      const file = fs.createReadStream(process.cwd() + `/${name}`);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      await wtiPut(`/files/${this._masterFileId}/locales/${locale}`, formData);
    } catch (err) {
      console.error(String(err));
      process.exit(1);
    }
  }

  async remove() {
    try {
      // return 202 if success with empty body
      // return 404 with WtiErrorResponse if file not found
      const response = await wtiDelete(`/files/${this._masterFileId}`);

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
