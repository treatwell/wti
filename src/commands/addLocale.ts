import cli from 'cli-ux';
import { Command } from '@oclif/command';
import kleur from 'kleur';

import { Locale } from '../models';

export default class AddLocale extends Command {
  static description = 'add a new locale to the project';

  static args = [{ name: 'locale' }];

  static usage = '$ wti addLocale fr';

  async run() {
    const {
      args: { locale },
    } = this.parse(AddLocale);

    if (locale) {
      cli.action.start(`Adding ${locale} as a locale...`);

      try {
        await new Locale(locale).create();

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
