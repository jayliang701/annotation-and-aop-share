import { randomUUID } from 'crypto';
import {
  Annotation,
  BeanClass,
  ClassHandler,
  ClassWithAnnotations,
  FunctionHandler,
  FunctionWithAnnotations,
} from './types';

type UnboxAnnotation<T> = T extends Annotation<infer U> ? U : T;

export const createFunctionAnnotation = <S extends Annotation>(namespace: string) => {
  return function <P extends UnboxAnnotation<S>, T extends (...args: any) => P>(
    func: T,
  ): {
    namespace: string;
    getAnnotation: (targetFunc: (...args: any) => any) => S | undefined;
  } & ((...args: Parameters<T>) => FunctionHandler) {
    const anf = (...args: Parameters<T>): FunctionHandler => {
      return innerCreateFunctionAnnotation<S>(namespace, func.apply(null, args));
    };
    anf.namespace = namespace;
    anf.getAnnotation = (targetFunc: (...args: any) => any): S | undefined => {
      const func = targetFunc as FunctionWithAnnotations;
      for (const annotationNamespace in func.$annotations) {
        if (annotationNamespace === namespace) {
          return func.$annotations[annotationNamespace] as S;
        }
      }
      return undefined;
    };
    return anf;
  };
};

function innerCreateFunctionAnnotation<T extends Annotation>(
  namespace: string,
  params: UnboxAnnotation<T>,
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const func: FunctionWithAnnotations = descriptor.value as any;
    if (!func.$annotations) func.$annotations = {};
    const annotation: Annotation = {
      namespace,
      params,
    };
    func.$annotations[namespace] = annotation;
  };
}

export const createClassAnnotation = <S extends Annotation>(namespace: string) => {
  return function <P extends UnboxAnnotation<S>, T extends (...args: any) => P>(
    func: T,
  ): {
    namespace: string;
    getAnnotation: <C extends { new (...args: any[]): {} }>(targetClass: C) => S | undefined;
  } & ((...args: Parameters<T>) => ClassHandler) {
    const anf = (...args: Parameters<T>): ClassHandler => {
      return innerCreateClassAnnotation<S>(namespace, func.apply(null, args));
    };
    anf.namespace = namespace;
    anf.getAnnotation = <C extends { new (...args: any[]): {} }>(targetClass: C): S | undefined => {
      const cls: ClassWithAnnotations = targetClass as any;
      for (const annotationNamespace in cls.$annotations) {
        if (annotationNamespace === namespace) {
          return cls.$annotations[annotationNamespace] as S;
        }
      }
      return undefined;
    };
    return anf;
  };
};

function innerCreateClassAnnotation<T extends Annotation>(
  namespace: string,
  params: UnboxAnnotation<T>,
) {
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
    descriptor.value['$beanInjector'] = {
      namespace,
    };
  };
}

export function Injectable(namespace: string) {
  return function <T extends { new (...args: any[]): {} }>(targetClass: T) {
    const beanClass: BeanClass = targetClass as any;
    beanClass.$namespace = namespace;
    return targetClass;
  };
}

function Inject(namespace?: string) {
  if (!namespace) namespace = randomUUID();
  return function <T extends { new (...args: any[]): {} }>(targetClass: T) {
    const beanClass: BeanClass = targetClass as any;
    beanClass.$isBean = true;
    Object.defineProperty(beanClass.prototype, 'beanMetadata', {
      value: { namespace: namespace! },
      writable: false,
    });
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
