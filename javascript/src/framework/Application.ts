import express, { Express } from "express";

export default class Application {
  private static app: Express;

  public get httpServer() {
    return Application.app;
  }

  constructor() {
    if (!this.httpServer) {
      throw new Error("Do not allow create multiple HTTP server instance.");
    }
    Application.app = express();
  }

  public run() {
    const port = process.env.PORT || 3000;
    this.httpServer.listen(port, () => {
      console.log(`HTTP server is listening on port ${port}`);
    });
  }
}
