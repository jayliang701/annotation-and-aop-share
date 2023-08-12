import { ClassWithAnnotations, IApplicationContext, IBeanLifeCycleHandler, IBean } from './types';

const injectedBeans: Record<string, IBean[]> = {};

const context: IApplicationContext = {
  getBeansByNamespace(namespace: string): IBean[] {
    const beans = injectedBeans[namespace] || [];
    return beans;
  },
  getBeansByAnnotationNamespace(annotationNamespace: string): IBean[] {
    const beans: IBean[] = [];
    for (const beanNamespace in injectedBeans) {
      for (const bean of injectedBeans[beanNamespace]) {
        const beanClass = bean.constructor as ClassWithAnnotations;
        if (beanClass.$annotations && beanClass.$annotations[annotationNamespace]) {
          beans.push(bean);
        }
      }
    }
    return beans;
  },
};

const isBeanClass = (Cls: { new (...args: any[]): {} }): boolean => {
  return !!Cls.prototype.beanMetadata;
};

export function inject(Cls: any) {
  if (!isBeanClass(Cls)) {
    throw new Error(`${Cls} is not a Bean Class. Can't be injected.`);
  }
  const bean = new Cls();
  injectBean(bean as IBean);
}

export function injectBean(bean: IBean) {
  const Cls = bean.constructor;
  const { $namespace: namespace } = Cls;

  injectedBeans[namespace] = injectedBeans[namespace] || [];
  injectedBeans[namespace].push(bean);

  console.log('inject bean', bean);

  Object.getOwnPropertyNames(Cls.prototype).forEach((key) => {
    const func = bean[key];
    if (typeof func === 'function') {
      const descriptor = Object.getOwnPropertyDescriptor(Cls.prototype, key);
      if (
        descriptor &&
        typeof descriptor.value === 'function' &&
        descriptor.value['$beanInjector']
      ) {
        const childBean = (descriptor.value as Function).apply(bean, []);
        injectBean(childBean);

        const childBeanWithLifeCycleHandler = childBean as IBeanLifeCycleHandler;
        if (!!childBeanWithLifeCycleHandler.onBeanInjected) {
          // This simple IoC framework doesn't handle Injection Sequence issue.
          // So using setTimeout here to ensure APIController is injected
          // before HttpServer starts to register routers
          setTimeout(() => {
            childBeanWithLifeCycleHandler.onBeanInjected(context);
          }, 0);
        }
      }
    }
  });
}
