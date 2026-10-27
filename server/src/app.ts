import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProd } from './config/env';
import { errorHandler, notFound } from './middleware/error';
import { apiLimiter } from './middleware/rateLimit';
import routes from './routes';

export const app = express();

app.set('trust proxy', isProd ? 1 : false); // behind Render/Railway/Nginx in prod
app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  })
);
if (!isProd) app.use(morgan('dev'));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api', apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);
