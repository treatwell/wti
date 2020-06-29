import fs from 'fs';
import path from 'path';
import gitRootDir from 'git-root-dir';

import {
  ConfigNotFoundError,
  NotGitDirectoryError,
  ConfigUpdateError,
} from '../errors';

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
 */
export const getConfigPath = async () => {
  const rootDir = await gitRootDir(process.cwd());

  if (rootDir) {
    const configFilePath = path.join(rootDir, CONFIG_NAME);

    return Promise.resolve(configFilePath);
  }

  throw new NotGitDirectoryError();
};

/**
 * Return the config as a JSON object
 */
export const getConfig = async () => {
  const configPath = await getConfigPath();

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
 */
export const updateConfig = async (newConfig: Config) => {
  const configPath = await getConfigPath();

  fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), (err) => {
    if (err) throw new ConfigUpdateError(String(err));
  });
};
