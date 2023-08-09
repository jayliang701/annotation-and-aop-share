import express, { Express } from 'express';
import HttpServer from './HttpServer';

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
    ExpressServer.app = express();
  }

  public run() {
    const { port } = this.configuration;
    this.server.listen(port, () => {
      console.log(`Express HTTP server is listening on port ${port}`);
    });
  }
}
