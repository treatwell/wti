import { WtiErrorResponse, wtiGet } from '../helpers';

import type { Statistic } from './types';

export class Status {
  async fetch(pathParam?: string) {
    try {
      const response = await wtiGet('/stats.json', pathParam);

      if (response.status !== 200) {
        const parsedResponse = (await response.json()) as WtiErrorResponse;

        return Promise.reject(parsedResponse.error);
      }

      return Promise.resolve(await response.json()) as Promise<{
        [locale: string]: Statistic;
      }>;
    } catch (err) {
      console.error(String(err));
      process.exit(1);
    }
  }
}
