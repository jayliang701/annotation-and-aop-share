import { Bean, Configuration } from '@framework/core/annotation';
import ExpressServer from '@framework/web/ExpressServer';
import HttpServer from '@framework/web/HttpServer';

@Configuration()
export default class ApplicationConfiguration {
  @Bean()
  public httpServer(): HttpServer {
    return new ExpressServer();
  }
}
