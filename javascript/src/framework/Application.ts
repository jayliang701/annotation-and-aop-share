export interface IApplication {
  run(): void;
}

export interface IApplicationProxy extends IApplication {
  readonly isWebApplication: boolean;
  readonly dependencyPaths: string[];
}
