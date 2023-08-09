import { randomUUID } from 'crypto';
import { BeanClass, ClassWithAnnotations } from './types';

export function createClassAnnotation(namespace: string, params: Record<string, any> = {}) {
  return function <T extends { new (...args: any[]): {} }>(targetClass: T) {
    const beanClass: ClassWithAnnotations = targetClass as any;
    if (!beanClass.$annotations) beanClass.$annotations = {};
    beanClass.$annotations[namespace] = {
      namespace,
      params,
    };
    return targetClass;
  };
}

export function Bean(namespace?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(descriptor.value.toString());
    descriptor.value['$beanInjector'] = {
      namespace,
    };
  };
}

export function Inject(namespace?: string) {
  if (!namespace) namespace = randomUUID();
  return function <T extends { new (...args: any[]): {} }>(targetClass: T) {
    const beanClass: BeanClass = targetClass as any;
    beanClass.$namespace = namespace as string;
    beanClass.$isBean = true;
    return targetClass;
  };
}

export function Component(namespace?: string) {
  return function <T extends { new (...args: any[]): {} }>(targetClass: T) {
    return Inject(namespace)(targetClass);
  };
}

export function Configuration(namespace?: string) {
  return function <T extends { new (...args: any[]): {} }>(targetClass: T) {
    return Inject(namespace)(targetClass);
  };
}
