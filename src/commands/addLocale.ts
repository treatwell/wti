import { Command, flags } from '@oclif/command';

import { Locale } from '../models';
import cli from 'cli-ux';
import kleur from 'kleur';

export default class AddLocale extends Command {
  static description = 'add a new locale to the project';

  static args = [{ name: 'locale' }];

  static flags = {
    configPath: flags.string({
      name: 'configPath',
      required: false,
      description: 'Path to wti-config.json file. If not provided, default to git root directory.'
    })
  };

  static usage = '$ wti addLocale fr';

  async run() {
    const {
      args: { locale },
      flags: { configPath }
    } = this.parse(AddLocale);

    if (locale) {
      cli.action.start(`Adding ${locale} as a locale...`);

      try {
        await new Locale(locale).create(configPath);

        cli.action.stop(
          `${kleur.green('[SUCCESS]')} Locale ${locale} is being added`
        );
      } catch (err) {
        cli.action.stop(`${kleur.red('[ERROR]')} ${err}`);
      }
    } else {
      this.log(`${kleur.red('[ERROR]')} Please specify a locale to add`);
    }
  }
}
