import cli from 'cli-ux';
import { Command } from '@oclif/command';

import { ConfigNotFoundError } from '../errors';
import { getConfig, updateConfig, initialConfig } from '../helpers';

export default class Init extends Command {
  static description = 'configure the project to sync with';

  async run() {
    let config = initialConfig;

    try {
      // get config object
      config = await getConfig();
    } catch (err) {
      // if it doesn't exist, create an empty one
      if (err instanceof ConfigNotFoundError) {
        await updateConfig(config);
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
      });

      cli.action.stop();
    }
  }
}
