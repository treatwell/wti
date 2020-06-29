import { BaseError } from 'make-error';

export class NotGitDirectoryError extends BaseError {
  constructor() {
    super('The folder on which you run the client should be a GIT directory');
  }
}

export class ConfigNotFoundError extends BaseError {
  constructor() {
    super('Config file does not exist, run `wti init` to initialize one');
  }
}

export class ConfigUpdateError extends BaseError {}

export class ProjectNotExistError extends BaseError {}

export class MasterFileAlreadyExistsError extends BaseError {}
