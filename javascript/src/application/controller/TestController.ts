import { Component } from '@framework/core/annotation';
import { API, APIController } from '../../framework/web/annotation';
import Express from 'express';

@Component()
@APIController('/test')
export default class TestController {
  TestController() {
    console.log(this['reportingURL'] as any);
  }

  @API('/echo')
  public echo(req: Express.Request, res: Express.Response) {
    console.log(`get [echo] request...`);
    console.log(req.body);
    res.json({
      msg: 'Hello',
      serverTime: Date.now(),
    });
  }
}
