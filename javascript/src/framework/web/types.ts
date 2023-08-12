import { Annotation } from '@framework/core/types';

export type RequsetMappingAnnotation = Annotation<{
  path: string;
}>;

export type GetMappingAnnotation = RequsetMappingAnnotation;

export type PostMappingAnnotation = RequsetMappingAnnotation;

export type APIControllerAnnotation = Annotation<{
  path?: string;
}>;

export interface HttpContext {
  getCookie: (key: string) => string | undefined;
  getRequestHead: (key: string) => string | undefined;
  get deviceFingerprint(): string | undefined;
  get accountId(): string | undefined;
}

export type APIHandler<RequestPayload = Record<string, any>, ResponseBody = void> = (
  params: RequestPayload,
  context?: HttpContext,
) => ResponseBody | Promise<ResponseBody>;
