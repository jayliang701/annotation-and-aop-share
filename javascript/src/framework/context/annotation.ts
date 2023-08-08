export function createAnnotation<T extends Function>(
  nameId: string,
  def: T,
  params: Record<string, any> = {}
): T {
  return function (...args: any[]) {
    const target = def(...args);
    if (!target.$annotations) target.$annotations = [];
    target.$annotations[nameId] = params;
    return target;
  } as any;
}

export function Bean<T extends { new (...args: any[]): {} }>(constructor: T) {
  constructor["$isBean"] = true;
  console.log(constructor);
  return class extends constructor {};
}
