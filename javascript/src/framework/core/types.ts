export type FunctionHandler = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => void;

export type ClassHandler = <T extends { new (...args: any[]): {} }>(targetClass: T) => T;

export type Annotation<T extends object = Record<string, any>> = {
  namespace: string;
  params: T;
};

export type FunctionWithAnnotations = {
  $annotations: Record<string, Annotation>;
} & ((...args: any) => any);

export type ClassWithAnnotations = {
  $annotations: Record<string, Annotation>;
} & { new (...args: any[]): {} };

export type BeanClass = {
  $namespace: string;
  $isBean: true;
} & ClassWithAnnotations;

export interface BeanHandler {
  beanInjected(bean: any, cls: BeanClass, container: any): void;
}

export interface IBean {
  constructor: BeanClass;
}

export interface IBeanLifeCycleHandler {
  onBeanInjected(context: IApplicationContext): void;
}

export interface IApplicationContext {
  getBeansByNamespace(namespace: string): IBean[];

  getBeansByAnnotationNamespace(annotationNamespace: string): IBean[];
}
