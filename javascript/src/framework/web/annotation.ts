import { createAnnotation } from "@framework/context/annotation";

export function API(path: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(path, target, propertyKey, descriptor);
  };
}

export function APIController(path: string) {
  return createAnnotation(
    "@framework/web/APIController",
    function InternalClass<T extends { new (...args: any[]): {} }>(
      constructor: T
    ) {
      return class extends constructor {};
    },
    {
      path,
    }
  );
}
