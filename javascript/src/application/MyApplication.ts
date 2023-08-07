import { WebApplication } from '@framework/annotation/core';

@WebApplication({
  scans: ['application/controller'],
})
export default class MyApplication {}
