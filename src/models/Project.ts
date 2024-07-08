import { WtiErrorResponse, wtiGet } from '../helpers';

import type { WTIProject } from './types';

export class Project {
  private _project: WTIProject;

  private static instance: Project;

  private constructor(project: WTIProject) {
    this._project = project;
  }

  public static async init(pathParam?: string) {
    if (!Project.instance) {
      try {
        const response = await wtiGet('.json', pathParam);

        // Project exists
        if (response.status === 200) {
          const parsedResponse = await (<Promise<{ project: WTIProject }>>(
            response.json()
          ));

          Project.instance = new Project(parsedResponse.project);
        }

        // Project doesn't exist
        if (response.status === 404) {
          const parsedResponse = await (<Promise<WtiErrorResponse>>(
            response.json()
          ));

          return Promise.reject(parsedResponse.error);
        }
      } catch (err) {
        console.error(String(err));
        process.exit(1);
      }
    }

    return Project.instance;
  }

  get name() {
    return this._project.name;
  }

  get projectFiles() {
    return this._project.project_files;
  }

  get projectMasterFiles() {
    return this._project.project_files.filter(
      (file) => file.master_project_file_id === null
    );
  }
}
