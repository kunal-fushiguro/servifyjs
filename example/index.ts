import { Servify } from '../dist/index';

const server = new Servify();

server.use(async (req, _, next) => {
  console.log(req.url);
  req.data = 'server';
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
server.get('/user/:id', (req, res) => {
  res.status(200).json({
    msg: `hello user ${req.params.id}`,
    route: req.url,
  });
});
server.get('/user/:id/:name', (req, res) => {
  res.status(200).json({
    msg: `hello ${req.params.name} ${req.params.id}`,
    route: req.url,
  });
});

server.get(
  '/query',
  (__, res, next) => {
    console.log('Hello');
    res.status(200).json({
      msg: 'hello',
    });
    // next();
  },
  async (req, res) => {
    res.status(200).json({
      msg: `hello ${req.query.name} ${req.data}`,
      route: req.url,
    });
  }
);

server.listen(3000, () => {
  console.log(`Server started on PORT : 3000`);
});
