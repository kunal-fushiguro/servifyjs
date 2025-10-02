import { ServerResponse } from 'node:http';
import { ResponseContext } from './types';
import fs from 'node:fs';

export class ResponseClass {
  httpResponse: ServerResponse;
  constructor(httpResponse: ServerResponse) {
    this.httpResponse = httpResponse;
  }

  getCustomResponse(): ResponseContext {
    return {
      json: this.sendJson.bind(this),
      status: this.addStatusCode.bind(this),
      setCookie: this.setCookies.bind(this),
      clearCookies: this.clearCookies.bind(this),
      sendHtml: this.sendHtml.bind(this),
    };
  }

  private addStatusCode(code: number) {
    this.httpResponse.statusCode = code;
    return this.getCustomResponse();
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

  private clearCookies() {
    this.httpResponse.setHeader('Set-Cookie', '');
  }

  private sendHtml(path: string) {
    const doFileExist = fs.existsSync(path);
    if (!doFileExist) {
      throw new Error(`file with the path : ${path} does not existed`);
    }
    fs.readFile(path, (err, data) => {
      if (err) {
        throw new Error(`Error while loading the file with the path : ${path}`);
      }
      this.httpResponse.writeHead(200, { 'Content-Type': 'text/html' });
      this.httpResponse.end(data);
    });
  }
}
