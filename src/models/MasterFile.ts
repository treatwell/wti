import {
  WtiErrorResponse,
  wtiDelete,
  wtiGet,
  wtiPost,
  wtiPut,
} from '../helpers';

import { MasterFileAlreadyExistsError } from '../errors';
import { WTIProjectFile } from './types';
import fs from 'fs';

type Translations = {
  [key: string]: Translations | string;
};

const writeTranslations = (path: fs.PathLike, data: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const replaceNullValues = (data: Translations) => {
  const newData: Translations = {};

  Object.keys(data)
    .sort()
    .forEach(function (key) {
      if (data[key] === null) {
        newData[key] = '';
      } else if (typeof data[key] === 'object') {
        newData[key] = replaceNullValues(data[key] as Translations);
      } else {
        newData[key] = data[key];
      }
    });

  return newData;
};

export class MasterFile {
  private _masterFileId: number;

  private static instance: MasterFile;

  constructor(masterFileId: number) {
    this._masterFileId = masterFileId;
  }

  public static async create(name: string) {
    try {
      const file = fs.readFileSync(process.cwd() + `/${name}`);

      const formData = new FormData();
      formData.append('file', new Blob([file]), name);
      formData.append('name', name);

      const response = await wtiPost('/files', formData);
      if (!response.ok) {
        throw new Error(`Failed to push new master file: ${await response.text()}`);
      }

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
      if (!response.ok) {
        throw new Error(`Failed to get master file: ${await response.text()}`);
      }

      const result = (await response.json()) as Translations;

      await writeTranslations(
        file.name,
        JSON.stringify(replaceNullValues(result), null, 2)
      );
    } catch (err) {
      console.error(String(err));
      process.exit(1);
    }
  }

  async update(
    name: string,
    locale: string,
    options: {
      merge: boolean;
      'ignore-missing': boolean;
      label?: string;
    }
  ) {
    try {
      const file = fs.readFileSync(process.cwd() + `/${name}`);

      const formData = new FormData();
      formData.append('file', new Blob([file]), name);
      formData.append('name', name);
      if (options.merge) {
        formData.append('merge', 'true');
      }
      if (options['ignore-missing']) {
        formData.append('ignore_missing', 'true');
      }
      if (options.label) {
        formData.append('label', options.label);
      }

      const response = await wtiPut(`/files/${this._masterFileId}/locales/${locale}`, formData);
      if (!response.ok) {
        throw new Error(`Failed to get master file: ${await response.text()}`);
      }
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
