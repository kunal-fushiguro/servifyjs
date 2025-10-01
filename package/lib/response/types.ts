export interface ResponseContext {
  json: (data: any) => void;
  status: (code: number) => ResponseContext;
  setCookie: (
    name: string,
    value: string,
    options: {
      httpOnly?: boolean;
      secure?: boolean;
      maxAge?: number;
      sameSite?: 'Strict' | 'Lax' | 'None';
    }
  ) => void;
  clearCookies: () => void;
}
