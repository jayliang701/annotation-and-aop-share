import { IApplicationProxy } from './Application';
import path from 'path';
import recursive from 'recursive-readdir';
import { inject } from './context/container';

export function resolveClass(namespace: string) {
  try {
    const module = require(path.resolve(__dirname, '../../dist', namespace + '.js'));
    return module.default;
  } catch {
    return null;
  }
}

export function resolveJSFiles(namespace: string): Promise<any[]> {
  const folder = path.resolve(__dirname, '../../dist', namespace);
  return new Promise((resolve) => {
    recursive(folder).then(
      function (files: string[]) {
        const jsFiles: string[] = files.filter((file) => file.endsWith('.js'));
        resolve(jsFiles);
      },
      function (error) {
        console.error('something exploded', error);
      },
    );
  });
}

export async function startup<T>(entry: T) {
  const app: IApplicationProxy = entry as IApplicationProxy;
  if (!app.isWebApplication) {
    throw new Error("Can't startup. This is not a WebApplication.");
  }

  // dependency injection
  const paths: string[] = app.dependencyPaths || [];
  const scanedClasses: any[] = [];
  for (const filePath of paths) {
    const DependencyClass = resolveClass(filePath);
    if (!DependencyClass) {
      const jsFiles = await resolveJSFiles(filePath);
      jsFiles.forEach((jsFile) => {
        scanedClasses.push({
          namespace: filePath,
          Cls: require(jsFile).default,
        });
      });
    } else {
      scanedClasses.push({
        namespace: filePath,
        Cls: DependencyClass,
      });
    }
  }

  for (const { namespace, Cls } of scanedClasses) {
    inject(namespace, Cls);
  }
}
