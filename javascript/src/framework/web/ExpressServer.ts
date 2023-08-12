import express, { Express } from 'express';
import bodyParser from 'body-parser';
import HttpServer from './HttpServer';
import { HttpContext } from './types';

export default class ExpressServer extends HttpServer {
  private static app: Express;

  public get server() {
    return ExpressServer.app;
  }

  constructor() {
    super();
    if (!!this.server) {
      throw new Error('Do not allow create multiple HTTP server instance.');
    }
    const app = express();
    app.use(bodyParser.json());
    ExpressServer.app = app;
  }

  protected buildContext(req: express.Request, res: express.Response): HttpContext {
    return {
      getCookie: (key: string) => req.cookies[key] as string | undefined,
      getRequestHead: (key: string) => req.headers[key] as string | undefined,
      deviceFingerprint: req.body?.deviceFingerprint,
      accountId: req.headers['CONTEXT_ACCOUNT_ID'] as string | undefined,
    };
  }

  protected registerGetRouter(pathname: string, func: Function) {
    console.log(`register GET router: ${pathname}`);
    this.server.get(pathname, async (req: express.Request, res: express.Response) => {
      const resBody = await func(req.query, this.buildContext(req, res));
      res.json(resBody);
    });
  }

  protected registerPostRouter(pathname: string, func: Function) {
    console.log(`register POST router: ${pathname}`);
    this.server.post(pathname, async (req: express.Request, res: express.Response) => {
      const resBody = await func(req.body, this.buildContext(req, res));
      res.json(resBody);
    });
  }

  protected override run() {
    const { port } = this.configuration;
    this.server.listen(port, () => {
      console.log(`Express HTTP server is listening on port ${port}`);
    });
  }
}
