import path from 'path';
import recursive from 'recursive-readdir';
import { inject } from './core/container';
import { BeanClass } from './core/types';

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

export async function startup({ scans }: { scans: string[] }) {
  // dependency injection
  const paths: string[] = scans;
  const scanedClasses: any[] = [];
  for (const filePath of paths) {
    const ResolvedClass = resolveClass(filePath);
    if (!ResolvedClass) {
      const jsFiles = await resolveJSFiles(filePath);
      jsFiles.forEach((jsFile) => {
        scanedClasses.push(require(jsFile).default);
      });
    } else {
      scanedClasses.push(ResolvedClass);
    }
  }

  for (const cls of scanedClasses) {
    const BeanClass = cls as BeanClass;
    if (BeanClass.$isBean) {
      inject(BeanClass);
    }
  }
}
