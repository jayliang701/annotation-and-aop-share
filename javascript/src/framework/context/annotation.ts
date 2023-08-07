export function createAnnotation<T extends Function>(nameId: string, def: T): T {
  return function (...args: any[]) {
    const target = def(...args);
    if (!target.$annotations) target.$annotations = [];
    target.$annotations[nameId] = [...args];
    return target;
  } as any;
}

export function Bean<T extends { new (...args: any[]): {} }>(constructor: T) {
  constructor['$isBean'] = true;
  return class extends constructor {};
}
