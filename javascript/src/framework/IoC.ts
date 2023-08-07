import fs from "fs";
import path from "path";
import Application from "./Application";

export function resolveClass(namespace: string) {
  const module = require(path.resolve(
    __dirname,
    "../../dist",
    namespace + ".js"
  ));
  return module.default;
}

export function startup<T extends Application>(application: T) {
  // dependency injection
  const paths: string[] = application["__dependencyPaths"] || [];
  for (const filePath of paths) {
    const DependencyClass = resolveClass(filePath);
    console.log(DependencyClass);
  }

  // startup
  application.run();
}
