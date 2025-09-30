import { HandlerType, RequestCtx, ResponseCtx, Route, RouteMap } from '../types';

export class Router {
  protected routeMap: RouteMap;
  constructor() {
    this.routeMap = {};
  }

  //    add Router
  private addRoute(method: string, path: string, handler: HandlerType) {
    const keys: string[] = [];
    const methodName = method.toUpperCase();
    const regex = new RegExp(
      '^' +
        path.replace(/:([^/]+)/g, (_, key) => {
          keys.push(key);
          return '([^/]+)';
        }) +
        '$'
    );

    if (!this.routeMap[methodName]) {
      this.routeMap[methodName] = [];
    }
    this.routeMap[methodName].push({
      regex,
      method: methodName,
      keys,
      handler,
      path,
    });
  }

  // All Methods
  get(path: string, handler: Route['handler']) {
    this.addRoute('GET', path, handler);
  }

  post(path: string, handler: Route['handler']) {
    this.addRoute('POST', path, handler);
  }

  put(path: string, handler: Route['handler']) {
    this.addRoute('PUT', path, handler);
  }

  patch(path: string, handler: Route['handler']) {
    this.addRoute('PATCH', path, handler);
  }

  delete(path: string, handler: Route['handler']) {
    this.addRoute('DELETE', path, handler);
  }
}
