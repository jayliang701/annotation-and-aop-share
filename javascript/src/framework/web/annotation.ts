import { createClassAnnotation, createFunctionAnnotation } from '@framework/core/annotation';
import { APIControllerAnnotation, GetMappingAnnotation, PostMappingAnnotation } from './types';

export const GetMapping = createFunctionAnnotation<GetMappingAnnotation>(
  '@framework/web/GetMapping',
)((path: string) => {
  return {
    path,
  };
});

export const PostMapping = createFunctionAnnotation<PostMappingAnnotation>(
  '@framework/web/PostMapping',
)((path: string) => {
  return {
    path,
  };
});

export const APIController = createClassAnnotation<APIControllerAnnotation>(
  '@framework/web/APIController',
)((path: string) => {
  return {
    path,
  };
});
