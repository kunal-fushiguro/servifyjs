import { ServerResponse } from 'node:http';
import { ResponseContext } from './types';

export class ResponseClass {
  httpResponse: ServerResponse;
  constructor(httpResponse: ServerResponse) {
    this.httpResponse = httpResponse;
  }

  getResponse(): ResponseContext {
    return {
      json: this.sendJson,
      status: this.addStatusCode,
      setCookie: this.setCookies,
    };
  }

  private addStatusCode(code: number) {
    this.httpResponse.statusCode = code;
    return this.getResponse();
  }

  private sendJson(data: any) {
    this.httpResponse.setHeader('Content-Type', 'application/json');
    this.httpResponse.end(JSON.stringify(data));
  }

  private setCookies(
    name: string,
    value: string,
    options: {
      httpOnly?: boolean;
      secure?: boolean;
      maxAge?: number;
      sameSite?: 'Strict' | 'Lax' | 'None';
    } = {}
  ) {
    let newCookie = `${name}=${encodeURIComponent(value)}`;
    if (options.httpOnly) newCookie += '; HttpOnly';
    if (options.secure) newCookie += '; Secure';
    if (options.maxAge) newCookie += `; Max-Age=${options.maxAge}`;
    if (options.sameSite) newCookie += `; SameSite=${options.sameSite}`;

    this.httpResponse.setHeader('Set-Cookie', newCookie);
  }
}
