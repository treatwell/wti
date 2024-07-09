import { Command, flags } from '@oclif/command';

import { Locale } from '../models';
import cli from 'cli-ux';
import kleur from 'kleur';

export default class RmLocale extends Command {
  static description = 'delete a locale from a project';

  static args = [{ name: 'locale' }];

  static flags = {
    configPath: flags.string({
      name: 'configPath',
      required: false,
      description: 'Path to wti-config.json file. If not provided, default to git root directory.'
    })
  };

  static usage = '$ wti rmLocale fr';

  async run() {
    const {
      args: { locale },
      flags: { configPath }
    } = this.parse(RmLocale);

    if (locale) {
      cli.action.start(`Removing ${locale} as a locale...`);

      try {
        await new Locale(locale).remove(configPath);

        cli.action.stop(
          `${kleur.green('[SUCCESS]')} Locale ${locale} is being removed`
        );
      } catch (err) {
        cli.action.stop(`${kleur.red('[ERROR]')} ${err}`);
      }
    } else {
      this.log(`${kleur.red('[ERROR]')} Please specify a locale to remove`);
    }
  }
}
