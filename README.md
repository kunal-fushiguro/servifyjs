# Servifyjs

A lightweight Node.js server framework to build APIs with middleware and routing support.

## Installation

```bash
npm install servifyjs
```

## Usages

```ts
import { Servify } from 'servfiy';

const app = new Servify();
const PORT = 3000;

// middleware
server.use(async (req, res, next) => {
  setTimeout(() => {
    next();
  }, 3000);
});

server.get('/', (req, res) => {
  res.status(200).json({
    msg: 'hello world ',
    route: req.url,
  });
});

server.listen(3000, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
```

---

## Upcomming Usages

- `JSX` and `TSX` support
- Streams File
