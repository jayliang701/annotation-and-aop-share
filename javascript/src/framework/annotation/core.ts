export function DependencyScan(paths: string[]) {
  return function InternalClass<T extends { new (...args: any[]): {} }>(
    constructor: T
  ) {
    return class extends constructor {
      __dependencyPaths = paths;
    };
  };
}

export function WebApplication(paths: string[]) {
  return function InternalClass<T extends { new (...args: any[]): {} }>(
    constructor: T
  ) {
    return class extends constructor {
      __dependencyPaths = paths;
    };
  };
}
