import Application, { IApplication, IApplicationProxy } from '@framework/Application';
import { createAnnotation } from '@framework/context/annotation';

export function DependencyScan(paths: string[]) {
  return function InternalClass<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      __dependencyPaths = paths;
    };
  };
}

export function WebApplication({ scans = [] }: { scans: string[] }) {
  return createAnnotation('@framework/core/WebApplication', function InternalClass<
    T extends { new (): {} },
  >(constructor: T) {
    return class extends Application implements IApplicationProxy {
      dependencyPaths = scans;
      isWebApplication = true;

      hosting = new constructor();

      public override run() {
        const app = this.hosting as IApplication;
        return app.run && app.run();
      }
    };
  });
}
