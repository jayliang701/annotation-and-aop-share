export type Annotation = {
  namespace: string;
  params: Record<string, any>;
};

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
