import cli from 'cli-ux';
import { Command, flags } from '@oclif/command';

import { Project, MasterFile } from '../models';

export default class Push extends Command {
  static description = 'push master language file';

  static flags = {
    merge: flags.boolean({
      description: 'merge strings with the ones on the server (default: true)',
      default: true,
      // may be reversed with --no-merge to override server values
      allowNo: true,
    }),
    label: flags.string({
      description: 'label to assign all changes made during this update',
    }),
    'ignore-missing': flags.boolean({
      description: 'disable obsoleting missing strings (default: true)',
      default: true,
      // may be reversed with --no-ignore-missing to obsolete missing strings
      allowNo: true,
    }),
  };

  async run() {
    const { projectFiles } = await Project.init();
    const { flags } = this.parse(Push);

    let masterFile = projectFiles.filter(
      (file) => file.master_project_file_id === null
    )[0];

    cli.action.start(`Pushing master file ${masterFile.name}...`);

    await new MasterFile(masterFile.id).update(
      masterFile.name,
      masterFile.locale_code,
      flags
    );

    cli.action.stop(
      'done. Note that it can take up to 1 min for 1000 segments to be uploaded'
    );
  }
}
