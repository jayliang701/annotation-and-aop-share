import { Injectable } from '@framework/core/annotation';
import { IApplicationContext, IBeanLifeCycleHandler } from '@framework/core/types';
import { APIController, GetMapping, PostMapping } from './annotation';
import {
  GetMappingAnnotation,
  HttpContext,
  PostMappingAnnotation,
  RequsetMappingAnnotation,
} from './types';
import { URL } from 'url';

const concatPath = (url1: string | undefined, url2: string | undefined): string => {
  url1 = url1 || '';
  url2 = url2 || '';
  if (!url1.endsWith('/')) url1 = url1 + '/';
  if (url2.startsWith('/')) url2 = url2.substring(1);
  return url1 + url2;
};

@Injectable('@framework/web/HttpServer')
export default class HttpServer implements IBeanLifeCycleHandler {
  configuration: {
    port: number;
    ip?: string;
  } = {
    port: parseInt(process.env.PORT || '3000'),
  };

  protected registerInjectedControllers(context: IApplicationContext) {
    const beans = context.getBeansByAnnotationNamespace('@framework/web/APIController');
    for (const bean of beans) {
      const apiControllerAnnotation = APIController.getAnnotation(bean.constructor)!;

      const { path: classLevelPath } = apiControllerAnnotation.params;

      Object.getOwnPropertyNames(bean.constructor.prototype).forEach((key) => {
        const func = bean[key];
        const getMappingAnnotation = GetMapping.getAnnotation(func);
        if (getMappingAnnotation) {
          this.registerGetRouter(
            concatPath(classLevelPath, getMappingAnnotation.params.path),
            func,
            getMappingAnnotation,
          );
          return;
        }

        const postMappingAnnotation = PostMapping.getAnnotation(func);
        if (postMappingAnnotation) {
          this.registerPostRouter(
            concatPath(classLevelPath, postMappingAnnotation.params.path),
            func,
            postMappingAnnotation,
          );
          return;
        }
      });
    }
  }

  protected registerGetRouter(pathname: string, func: Function, annotation: GetMappingAnnotation) {
    this.registerPostRouter(pathname, func, annotation);
  }

  protected registerPostRouter(
    pathname: string,
    func: Function,
    annotation: PostMappingAnnotation,
  ) {
    this.registerPostRouter(pathname, func, annotation);
  }

  protected registerRouter(pathname: string, func: Function, annotation: RequsetMappingAnnotation) {
    throw new Error(`registerRouter is not implemented`);
  }

  protected run() {}

  public onBeanInjected(context: IApplicationContext): void {
    this.registerInjectedControllers(context);
    this.run();
  }
}
