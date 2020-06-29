import type { Statistic } from '../models/types';
import { wtiGet, WtiErrorResponse } from '../helpers';

export class Status {
  async fetch() {
    try {
      const response = await wtiGet('/stats.json');

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
