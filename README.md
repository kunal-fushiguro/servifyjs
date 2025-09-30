# Servifyjs

A lightweight Node.js server framework to build APIs with middleware and routing support.

## Installation

```bash
npm install servifyjs
```

## Usages

```ts
import { Servify } from 'servifyjs';
import { userRouter } from './routes/userRouter';

const server = new Servify();
const PORT = 3000;

// Register user routes
server.route('/api', userRouter);

// Root route
server.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World',
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
```

`/routes/userRouter.ts`

```ts
import { Router } from 'servifyjs';

const userRouter = new Router();

userRouter.use((req, res, next) => {
  const { userName } = req.query;
  req.userName = userName;

  setTimeout(() => {
    next();
  }, 3000);
});

userRouter.get('/getUser', async (req, res) => {
  res.status(200).json({
    msg: `Hello ${req.userName}`,
  });
});

export { userRouter };
```

## Upcomming Usages

- `JSX` and `TSX` support
- Streams File
