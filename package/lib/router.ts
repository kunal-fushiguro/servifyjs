import { HandlerType, MiddlewaresHandlers, RouteMap } from './types';

export class Router {
  protected routeMap: RouteMap;
  protected middlewares: MiddlewaresHandlers[] = [];

  constructor() {
    this.routeMap = {};
    this.middlewares = [];
  }

  getRoutes() {
    return this.routeMap;
  }
  getMiddlewares() {
    return this.middlewares;
  }

  // add the middleware
  use(...middleware: MiddlewaresHandlers[]) {
    this.middlewares.push(...middleware);
  }

  // add Router
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
  get(path: string, ...handlers: MiddlewaresHandlers[]) {
    this.addRoute('GET', path, ...handlers);
  }

  post(path: string, ...handlers: MiddlewaresHandlers[]) {
    this.addRoute('POST', path, ...handlers);
  }

  put(path: string, ...handlers: MiddlewaresHandlers[]) {
    this.addRoute('PUT', path, ...handlers);
  }

  patch(path: string, ...handlers: MiddlewaresHandlers[]) {
    this.addRoute('PATCH', path, ...handlers);
  }

  delete(path: string, ...handlers: MiddlewaresHandlers[]) {
    this.addRoute('DELETE', path, ...handlers);
  }
}
