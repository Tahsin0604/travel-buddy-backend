import express, { Application } from 'express';
import cors from 'cors';
import router from './app/route';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import apiNotFound from './app/middleware/apiNotFound';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://tripbuddy-eta.vercel.app'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use(apiNotFound);

export default app;
