# Request

| Method               | Signature                            | Description                                         |
| -------------------- | ------------------------------------ | --------------------------------------------------- |
| **getCustomRequest** | `getCustomRequest(): RequestContext` | Returns a custom request object with all properties |
| **query**            | `query: Record<string, string>`      | Parsed query parameters from the URL                |
| **body**             | `body: unknown`                      | Request body (currently gathered asynchronously)    |
| **cookies**          | `cookies: Record<string, string>`    | Parsed cookies from the request headers             |
| **params**           | `params: Record<string, string>`     | URL route parameters (empty by default)             |
| **method**           | `method: string`                     | HTTP method of the request (GET, POST, etc.)        |
| **ipV4**             | `ipV4: string \| null`               | Client IPv4 address                                 |
| **ipV6**             | `ipV6: string \| null`               | Client IPv6 address                                 |
