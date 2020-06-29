import cli from 'cli-ux';
import { Command } from '@oclif/command';
import kleur from 'kleur';

import { Locale } from '../models';

export default class RmLocale extends Command {
  static description = 'delete a locale from a project';

  static args = [{ name: 'locale' }];

  static usage = '$ wti rmLocale fr';

  async run() {
    const {
      args: { locale },
    } = this.parse(RmLocale);

    if (locale) {
      cli.action.start(`Removing ${locale} as a locale...`);

      try {
        await new Locale(locale).remove();

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
