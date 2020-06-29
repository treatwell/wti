import cli from 'cli-ux';
import { Command } from '@oclif/command';
import kleur from 'kleur';

import { MasterFile, Project } from '../models';

export default class Rm extends Command {
  static description = 'delete a master language file from a project';

  static args = [{ name: 'masterFile' }];

  static usage = '$ wti rm locales/en/translation.json';

  async run() {
    const {
      args: { masterFile },
    } = this.parse(Rm);

    // TODO: inquirer to list master language files
    if (masterFile) {
      const remove = await cli.confirm(
        `Are you sure to remove ${masterFile}? Please note that deleting the master file, target files as well as segments and translations will be deleted as well. (yes/no)`
      );

      if (remove) {
        cli.action.start(`Removing ${masterFile}..`);
        const { projectMasterFiles } = await Project.init();

        const masterFileResult = projectMasterFiles.find(
          (file) => file.name === masterFile
        );

        if (!masterFileResult) {
          cli.action.stop();

          this.log(
            `${kleur.red(
              '[ERROR]'
            )} The specified master file isn't linked to that project`
          );
          process.exit(1);
        }

        await new MasterFile(masterFileResult.id).remove();

        cli.action.stop();
      }
    } else {
      this.log(
        `${kleur.red('[ERROR]')} Please specify a master file to remove`
      );
    }
  }
}
