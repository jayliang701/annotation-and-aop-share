import { BeanClass } from './types';

const beans: Map<string, any> = new Map();

const beanInjectListeners: Map<string, Function[]> = new Map();

export function inject(Cls: BeanClass) {
  const { $namespace: namespace } = Cls;

  const instance = new Cls();
  beans[namespace] = instance;
  console.log('inject bean', instance);

  Object.getOwnPropertyNames(Cls.prototype).forEach((key) => {
    const func = instance[key];
    if (typeof func === 'function') {
      const descriptor = Object.getOwnPropertyDescriptor(Cls.prototype, key);
      console.log(descriptor);
    }
  });

  notifyBeanInjection(Cls, instance);
}

function notifyBeanInjection(Cls: BeanClass, bean: any) {
  const listeners = beanInjectListeners.get(Cls.$namespace);
  if (!listeners) return;
  listeners.forEach((handler) => {
    handler(bean);
  });
}

export function addBeanInjectionListener(beanNamespace: string, handler: (bean: any) => void) {
  const listeners = beanInjectListeners.get(beanNamespace) || [];
  if (listeners.indexOf(handler) >= 0) return;

  listeners.push(handler);
  beanInjectListeners.set(beanNamespace, listeners);
}

export function injectHook() {}
