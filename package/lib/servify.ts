import http, { IncomingMessage, ServerResponse } from 'node:http';
import type { MethodNames } from './types';
import { Router } from './router';
import { RequestClass } from './request';
import { ResponseClass } from './response';

export class Servify extends Router {
  private server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  constructor() {
    super();
    this.server = http.createServer();
    this.server.on('request', (req: IncomingMessage, res: ServerResponse) => {
      this.handleRequest(req, res);
    });
  }
  //  start the server
  listen(port: number, cb?: () => void) {
    this.server.listen(port);
    if (cb) {
      cb();
    }
  }

  // handle incomming Request
  private handleRequest(req: IncomingMessage, res: ServerResponse) {
    const request = new RequestClass(req).getCustomRequest();
    const response = new ResponseClass(res).getCustomResponse();

    const { url, method } = req;
    if (!url || !method) {
      return response.status(400).json({ error: 'Bad Request' });
    }
    const [urlWithoutParams, _] = req.url?.split('?') || [];
    const routes = this.routeMap[request.method.toUpperCase()] || [];

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

  // add Router
  route(basePath: string, router: Router) {
    const routes = router.getRoutes();
    const baseMiddlewares = router.getMiddlewares();

    for (const method in routes) {
      for (const route of routes[method]) {
        const newPath = `${basePath}${route.path}`;
        const methodName = method.toLowerCase() as MethodNames;

        (this as any)[methodName](
          newPath,
          ...baseMiddlewares,
          ...(route.middlewares || []),
          route.handler
        );
      }
    }
  }
}
