export interface RequestContext {
  [key: string]: any;
  body: unknown;
  params: Record<string, string>;
  query: Record<string, string>;
  cookies: Record<string, string>;
  method: string;
  ipV4: string | null;
  ipV6: string | null;
}
