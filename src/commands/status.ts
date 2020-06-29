import cli from 'cli-ux';
import { Command } from '@oclif/command';
import kleur from 'kleur';

import { Status as StatusModel } from '../models';

export default class Status extends Command {
  static description = 'fetch and display project statistics';

  static usage = '$ wti status';

  async run() {
    cli.action.start(`Loading statistics...`);

    try {
      const stats = await new StatusModel().fetch();
      cli.action.stop();

      const locales = Object.keys(stats);

      locales.forEach((locale) => {
        const percentage = (
          ((stats[locale].count_strings -
            stats[locale].count_strings_to_translate) *
            100) /
          stats[locale].count_strings
        ).toFixed(2);

        this.log(
          `${kleur.green(`[${locale}]`)} ${
            isNaN(Number(percentage)) ? 0 : percentage
          }% translated`
        );
      });
    } catch (err) {
      cli.action.stop(`${kleur.red('[ERROR]')} ${err}`);
    }
  }
}
