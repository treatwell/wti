import { Command } from '@oclif/command';
import kleur from 'kleur';
import Listr from 'listr';

import { Project, MasterFile } from '../models';

export default class Pull extends Command {
  static description = 'pull target language file(s)';

  async run() {
    const { projectFiles } = await Project.init();

    let masterFile = projectFiles.filter(
        (file) => file.master_project_file_id === null
      )[0],
      masterFileId = masterFile.id;

    const tasks = new Listr(
      projectFiles.reduce(
        (acc, current) =>
          acc.concat({
            title: `Pulling ${current.name}`,
            task: async () => await new MasterFile(masterFileId).show(current),
          }),
        [] as Listr.ListrTask<Listr.ListrContext>[]
      )
    );

    tasks.run().catch((err) => {
      this.log(`${kleur.red('[ERROR]')} ${err}`);
    });
  }
}
