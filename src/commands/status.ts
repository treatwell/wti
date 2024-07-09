import { Command, flags } from '@oclif/command';

import { Status as StatusModel } from '../models';
import cli from 'cli-ux';
import kleur from 'kleur';

export default class Status extends Command {
  static description = 'fetch and display project statistics';

  static flags = {
    configPath: flags.string({
      name: 'configPath',
      required: false,
      description: 'Path to wti-config.json file. If not provided, default to git root directory.'
    })
  };

  static usage = '$ wti status';

  async run() {
    cli.action.start(`Loading statistics...`);
    const { flags: { configPath } } = this.parse(Status);

    try {
      const stats = await new StatusModel().fetch(configPath);
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
