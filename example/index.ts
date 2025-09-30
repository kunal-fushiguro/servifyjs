import { Servify } from 'servifyjs';
import { userRouter } from './routes/userRouter';

const server = new Servify();

//  user route
server.route('/api', userRouter);

server.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World',
  });
});

server.listen(3000, () => {
  console.log(`Server started on PORT : 3000`);
});
