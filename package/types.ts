import { IncomingMessage, ServerResponse } from 'node:http';

//  routes type
export interface Route {
  method: string;
  path: string;
  regex: RegExp;
  keys: string[] | [];
  handler: (request: RequestCtx, response: ResponseCtx) => void | Promise<void>;
}

export interface RouteMap {
  [method: string]: Route[];
}

//  request and respone type
export interface RequestCtx extends IncomingMessage {
  [key: string]: any;
  body?: unknown;
  params: Record<string, string>;
  query: Record<string, string>;
}
export interface ResponseCtx extends ServerResponse {
  status: (code: number) => ResponseCtx;
  json: (data: any) => void;
  [key: string]: any;
}
