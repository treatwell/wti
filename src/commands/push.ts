import cli from 'cli-ux';
import { Command } from '@oclif/command';

import { Project, MasterFile } from '../models';

export default class Push extends Command {
  static description = 'push master language file';

  async run() {
    const { projectFiles } = await Project.init();

    let masterFile = projectFiles.filter(
      (file) => file.master_project_file_id === null
    )[0];

    cli.action.start(`Pushing master file ${masterFile.name}...`);

    await new MasterFile(masterFile.id).update(
      masterFile.name,
      masterFile.locale_code
    );

    cli.action.stop(
      'done. Note that it can take up to 1 min for 1000 segments to be uploaded'
    );
  }
}
