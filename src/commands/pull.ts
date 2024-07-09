import { Command, flags } from '@oclif/command';
import { MasterFile, Project } from '../models';

import Listr from 'listr';
import kleur from 'kleur';

export default class Pull extends Command {
  static description = 'pull target language file(s)';

  static flags = {
    configPath: flags.string({
      name: 'configPath',
      required: false,
      description: 'Path to wti-config.json file. If not provided, default to git root directory.'
    })
  };

  async run() {
    const { flags: { configPath } } = this.parse(Pull);
    const { projectFiles } = await Project.init(configPath);

    let masterFile = projectFiles.filter(
        (file) => file.master_project_file_id === null
      )[0],
      masterFileId = masterFile.id;

    const tasks = new Listr(
      projectFiles.reduce(
        (acc, current) =>
          acc.concat({
            title: `Pulling ${current.name}`,
            task: async () => await new MasterFile(masterFileId).show(current, configPath),
          }),
        [] as Listr.ListrTask<Listr.ListrContext>[]
      )
    );

    tasks.run().catch((err) => {
      this.log(`${kleur.red('[ERROR]')} ${err}`);
    });
  }
}
