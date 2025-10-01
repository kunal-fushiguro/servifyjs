import { IncomingMessage } from 'node:http';
import { RequestContext } from './types';

export class RequestClass {
  private httpRequest: IncomingMessage;
  constructor(httpRequest: IncomingMessage) {
    this.httpRequest = httpRequest;
  }

  getCustomRequest(): RequestContext {
    return {
      query: this.getQuery(),
      body: this.getBody(),
      method: this.getMethod(),
      ipV4: this.getIpAddressV4(),
      ipV6: this.getIpAddressV6(),
      cookies: this.getCookies(),
      params: {},
    };
  }

  private getQuery(): Record<string, string> {
    const { url } = this.httpRequest;
    const [_, queryString] = url?.split('?') as string[];
    if (!url || !queryString) {
      return {};
    }

    const data: Record<string, string> = {};
    const pairs = [...queryString.matchAll(/([^=&]+)=([^&]*)/g)];
    for (const [, key, value] of pairs) {
      data[key] = decodeURIComponent(value);
    }

    return data;
  }

  private getBody() {
    const bodyData: Uint8Array[] = [];
    this.httpRequest.on('data', (chunk: Uint8Array) => {
      bodyData.push(chunk);
    });

    this.httpRequest.on('end', () => {
      const fullBody = Buffer.concat(bodyData).toString();
      return fullBody;
    });
  }

  private getCookies() {
    const cookieHeader = this.httpRequest.headers['cookie'];
    if (!cookieHeader) {
      return {};
    }
    const cookies: Record<string, string> = {};
    const data = cookieHeader.split(';').map((c) => c.trim());
    for (const c of data) {
      const [name, value] = c.split('=');
      cookies[name] = decodeURIComponent(value);
    }
    return cookies;
  }

  private getMethod() {
    return this.httpRequest.method || '';
  }

  private getIpAddressV4() {
    let ip =
      this.httpRequest.socket.remoteAddress ||
      this.httpRequest.connection?.remoteAddress ||
      (this.httpRequest.headers['x-forwarded-for'] as string);

    if (!ip) {
      return null;
    }
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    if (ip.startsWith('::ffff:')) {
      return ip.substring(7);
    }
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
      return ip;
    }

    return null;
  }

  private getIpAddressV6() {
    let ip =
      this.httpRequest.socket.remoteAddress ||
      this.httpRequest.connection?.remoteAddress ||
      (this.httpRequest.headers['x-forwarded-for'] as string);

    if (!ip) return null;

    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    if (ip.includes(':') && !ip.startsWith('::ffff:')) {
      return ip;
    }

    return null;
  }
}
