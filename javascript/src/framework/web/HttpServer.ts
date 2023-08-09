export default abstract class HttpServer {
  configuration: {
    port: number;
    ip?: string;
  } = {
    port: parseInt(process.env.PORT || '3000'),
  };

  protected registerControllers() {}

  public run() {}
}
