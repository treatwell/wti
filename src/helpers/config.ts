import {
  ConfigNotFoundError,
  ConfigUpdateError,
  NotGitDirectoryError,
} from '../errors';

import fs from 'fs';
import gitRootDir from 'git-root-dir';
import path from 'path';

interface Config {
  project: {
    apiKey: string;
  };
}

const CONFIG_NAME = 'wti-config.json';

export const initialConfig: Config = {
  project: { apiKey: '' },
};

/**
 * Return the path of the config file
 *
 * @param pathParam path to the config file if defined in the command. Overrides the default git root dir
 */
export const getConfigPath = async (pathParam?: string) => {
  if (pathParam) {
    return path.join(process.cwd(), pathParam);
  }

  const rootDir = await gitRootDir(process.cwd());

  if (rootDir) {
    return path.join(rootDir, CONFIG_NAME);
  }

  throw new NotGitDirectoryError();
};

/**
 * Return the config as a JSON object
 *
 * @param pathParam path to the config file if defined in the command. Overrides the default git root dir
 */
export const getConfig = async (pathParam?: string) => {
  const configPath = await getConfigPath(pathParam);

  if (fs.existsSync(configPath)) {
    return (await require(configPath)) as Config;
  } else {
    throw new ConfigNotFoundError();
  }
};

/**
 * Update the config object
 *
 * @param newConfig new config object to write to file
 * @param pathParam path to the config file if defined in the command. Overrides the default git root dir
 */
export const updateConfig = async (newConfig: Config, pathParam?: string) => {
  const configPath = await getConfigPath(pathParam);

  fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), (err) => {
    if (err) throw new ConfigUpdateError(String(err));
  });
};
