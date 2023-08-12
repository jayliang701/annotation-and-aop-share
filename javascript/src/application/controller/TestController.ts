import { Component } from '@framework/core/annotation';
import { GetMapping, APIController, PostMapping } from '../../framework/web/annotation';
import dayjs from 'dayjs';

@Component()
@APIController('/test')
export default class TestController {
  @GetMapping('/time')
  public getServerTime({ format }: { format?: string }) {
    console.log(`get [time] request...`);
    return {
      serverTime: dayjs(Date.now()).format(format || 'YYYY-MM-DD HH:mm:ss'),
    };
  }

  @PostMapping('/time')
  public updateServerTime({ time }: { time: string }) {
    console.log(`post [time] request...`);
    return {
      updatedTime: time,
    };
  }

  @PostMapping('/echo')
  public echo({ name }: { name?: string }) {
    console.log(`post [echo] request...`);
    return {
      msg: `Hello, ${name}`,
    };
  }
}
