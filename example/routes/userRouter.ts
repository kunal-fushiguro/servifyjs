import { Router } from '../../dist';

const userRouter = new Router();
userRouter.use((req, res, next) => {
  const { userName } = req.query;
  req.userName = userName;
  setTimeout(() => {
    next();
  }, 3000);
});

userRouter.get('/getuser', async (req, res) => {
  res.status(200).json({
    msg: `Hello ${req.userName}`,
  });
});
export { userRouter };
