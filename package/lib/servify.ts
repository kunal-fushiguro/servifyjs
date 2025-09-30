import http from 'node:http';
import type { RouteMap, Route, ResponseCtx, RequestCtx } from '../types';

export class Servify {
  private server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private routeMap: RouteMap;
  constructor() {
    this.routeMap = {};
    this.server = http.createServer();
    this.server.on('request', (req: RequestCtx, res: ResponseCtx) => {
      this.handleRequest(req, res);
    });
  }

  listen(port: number, cb?: () => void) {
    this.server.listen(port);
    if (cb) {
      cb();
    }
  }

  //  add routes
  private addRoute(method: string, path: string, handler: Route['handler']) {
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
  //  hanlde incomming request
  private handleRequest(request: RequestCtx, response: ResponseCtx) {
    response.status = (code: number) => {
      response.statusCode = code;
      return response;
    };
    response.json = (data: any) => {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(data));
    };

    const { url, method } = request;
    if (!url || !method) {
      return response.status(400).json({ error: 'Bad Request' });
    }

    const [urlWithoutParams, queryString] = url.split('?');
    request.query = {};

    if (queryString) {
      const pairs = [...queryString.matchAll(/([^=&]+)=([^&]*)/g)];
      for (const [, key, value] of pairs) {
        request.query[key] = decodeURIComponent(value);
      }
    }

    const routes = this.routeMap[method.toUpperCase()] || [];

    for (const route of routes) {
      const match = urlWithoutParams.match(route.regex);
      if (match) {
        request.params = {};
        route.keys.forEach((key, i) => {
          request.params[key] = match[i + 1];
        });

        return route.handler(request, response);
      }
    }

    return response.status(404).json({ error: `Cannot ${method} ${urlWithoutParams}` });
  }

  //  methods
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
