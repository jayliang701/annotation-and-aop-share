const beans: Map<string, any> = new Map();

export function inject(namespace: string, Cls: { new (...args: any[]) }) {
  if (!Cls['$isBean']) return;

  const instance = new Cls();

  for (const [_, bean] of beans) {
    console.log(bean);
  }
  console.log('inject bean', namespace);

  beans[namespace] = instance;

  const annotations: any[] = Cls['$annotations'];
  if (!(annotations instanceof Array && annotations.length > 0)) {
    return;
  }
}

export function injectHook() {}
