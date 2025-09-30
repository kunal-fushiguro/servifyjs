import http from 'node:http';
import type { RouteMap, Route, ResponseCtx, RequestCtx } from '../types';
import { Router } from './router';

export class Servify extends Router {
  private server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  constructor() {
    super();
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

  // handle incomming Request
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

        const stack = [...this.middlewares, ...(route.middlewares || []), route.handler];
        let idx = 0;
        const next = () => {
          const fn = stack[idx++];
          if (fn) fn(request, response, next);
        };

        return next();
      }
    }

    return response.status(404).json({ error: `Cannot ${method} ${urlWithoutParams}` });
  }
}
