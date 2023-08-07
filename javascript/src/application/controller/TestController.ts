import { Bean } from '@framework/context/annotation';
import { API, APIController } from '../../framework/annotation/web';
import Express from 'express';

@Bean
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
