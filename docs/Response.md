# Response

| Method           | Signature                                                               | Description                          |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| **status**       | `status(code: number): ResponseContext`                                 | Sets the HTTP status code            |
| **json**         | `json(data: any): void`                                                 | Sends a JSON response                |
| **setCookie**    | `setCookie(name: string, value: string, options?: CookieOptions): void` | Sets a cookie with optional settings |
| **clearCookies** | `clearCookies(): void`                                                  | Clears all cookies                   |
