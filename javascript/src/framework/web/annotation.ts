import { createClassAnnotation } from '@framework/core/annotation';

export function API(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // console.log(path, target, propertyKey, descriptor);
  };
}

export function APIController(path: string) {
  return createClassAnnotation('@framework/web/APIController', {
    path,
  });
}
