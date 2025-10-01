import { RequestContext } from './request/types';
import { ResponseContext } from './response/types';

//  routes type
export interface Route {
  method: string;
  path: string;
  regex: RegExp;
  keys: string[] | [];
  handler: HandlerType;
  middlewares?: MiddlewaresHandlers[];
}

export interface RouteMap {
  [method: string]: Route[];
}

export type HandlerType = (
  request: RequestContext,
  response: ResponseContext
) => void | Promise<void>;
export type MiddlewaresHandlers = (
  request: RequestContext,
  response: ResponseContext,
  next: () => void
) => void | Promise<void>;
export type MethodNames = 'get' | 'post' | 'put' | 'patch' | 'delete';
