import { Servify } from '../package/index';

const server = new Servify();

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

server.get('/query', (req, res) => {
  res.status(200).json({
    msg: `hello ${req.query.name}`,
    route: req.url,
  });
});

server.listen(3000, () => {
  console.log(`Server started on PORT : 3000`);
});
