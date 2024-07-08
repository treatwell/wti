import { Command, flags } from '@oclif/command';
import { getConfig, initialConfig, updateConfig } from '../helpers';

import { ConfigNotFoundError } from '../errors';
import cli from 'cli-ux';

export default class Init extends Command {
  static description = 'configure the project to sync with';

  static flags = {
    configPath: flags.string({
      name: 'configPath',
      required: false,
      description: 'Path to wti-config.json file. If not provided, default to git root directory.'
    })
  };

  async run() {
    const { flags: { configPath } } = this.parse(Init);
    let config = initialConfig;

    try {
      // get config object
      config = await getConfig(configPath);
    } catch (err) {
      // if it doesn't exist, create an empty one
      if (err instanceof ConfigNotFoundError) {
        await updateConfig(config, configPath);
      }
    } finally {
      // if apiKey is set, ask if it's ok to override it
      if (config.project.apiKey) {
        const override = await cli.confirm(
          'You already have a project configured. Do you want to override it? (yes/no)'
        );

        // exit in case of no override
        if (!override) this.exit();
      }

      // or else ask for apiKey and save it
      const apiKey = await cli.prompt("What is your project's api key?");

      cli.action.start('Initializing...');

      await updateConfig({
        ...config,
        project: {
          apiKey,
        },
      }, configPath);

      cli.action.stop();
    }
  }
}
