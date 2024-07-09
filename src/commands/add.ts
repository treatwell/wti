import { Command, flags } from '@oclif/command';

import { MasterFile } from '../models';
import { MasterFileAlreadyExistsError } from '../errors';
import cli from 'cli-ux';
import kleur from 'kleur';

export default class Add extends Command {
  static description = 'create and push a new master language file';

  static args = [{ name: 'masterFile' }];

  static flags = {
    configPath: flags.string({
      name: 'configPath',
      required: false,
      description: 'Path to wti-config.json file. If not provided, default to git root directory.'
    })
  };

  static usage = '$ wti add locales/en/translation.json';

  async run() {
    const {
      args: { masterFile },
      flags: { configPath }
    } = this.parse(Add);

    if (masterFile) {
      cli.action.start(`Adding ${masterFile} as a master file...`);

      try {
        await MasterFile.create(masterFile, configPath);

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
