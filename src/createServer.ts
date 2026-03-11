import 'dotenv/config';
import express from 'express';
import { router as messageRouter } from './routes/message.routes';
import cors from 'cors';
import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { router as roomRouter } from './routes/room.routes';
import { router as userRouter } from './routes/user.routes';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

export const createServer = () => {
  const app = express();
  const limiter = rateLimit({
    windowMs: 1000 * 60 * 3,
    limit: 1000,
  });
  const client = process.env.CLIENT_URL;

  app.use(limiter);
  // app.use(morgan('combined'));
  app.use(
    cors({
      origin: client,
      credentials: true,
      allowedHeaders: '*'
    }),
  );

  app.use(express.json());

  app.use('/messages', messageRouter);
  app.use('/rooms', roomRouter);
  app.use('/users/', userRouter)

  app.use(ErrorMiddleware);

  return app;
};
