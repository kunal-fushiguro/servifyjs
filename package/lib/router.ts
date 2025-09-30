import { HandlerType, MiddlewaresHandlers, RouteMap } from '../types';

export class Router {
  protected routeMap: RouteMap;
  protected middlewares: MiddlewaresHandlers[] = [];
  constructor() {
    this.routeMap = {};
    this.middlewares = [];
  }

  use(...middleware: MiddlewaresHandlers[]) {
    this.middlewares.push(...middleware);
  }

  //    add Router
  private addRoute(method: string, path: string, ...handlers: MiddlewaresHandlers[]) {
    const keys: string[] = [];
    const methodName = method.toUpperCase();
    const handler = handlers.pop() as HandlerType;
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
      middlewares: handlers,
    });
  }

  // All Methods
  get(path: string, handler: HandlerType) {
    this.addRoute('GET', path, handler);
  }

  post(path: string, handler: HandlerType) {
    this.addRoute('POST', path, handler);
  }

  put(path: string, handler: HandlerType) {
    this.addRoute('PUT', path, handler);
  }

  patch(path: string, handler: HandlerType) {
    this.addRoute('PATCH', path, handler);
  }

  delete(path: string, handler: HandlerType) {
    this.addRoute('DELETE', path, handler);
  }
}
