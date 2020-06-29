import cli from 'cli-ux';
import { Command } from '@oclif/command';
import kleur from 'kleur';

import { MasterFile } from '../models';
import { MasterFileAlreadyExistsError } from '../errors';

export default class Add extends Command {
  static description = 'create and push a new master language file';

  static args = [{ name: 'masterFile' }];

  static usage = '$ wti add locales/en/translation.json';

  async run() {
    const {
      args: { masterFile },
    } = this.parse(Add);

    if (masterFile) {
      cli.action.start(`Adding ${masterFile} as a master file...`);

      try {
        await MasterFile.create(masterFile);

        cli.action.stop();

        this.log(
          `${kleur.green('[SUCCESS]')} Master file ${masterFile} is being added`
        );
      } catch (err) {
        cli.action.stop();

        if (err instanceof MasterFileAlreadyExistsError) {
          this.log(
            `${kleur.red('[ERROR]')} Master file ${masterFile} already exist`
          );
        }
      }
    } else {
      this.log(`${kleur.red('[ERROR]')} Please specify a master file to add`);
    }
  }
}
