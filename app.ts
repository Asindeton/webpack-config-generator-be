import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import authRouter from './routes/auth';
import configRouter from './routes/configRouter';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/config', configRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({
    statusCode: 404
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.json({
    statusCode: 500,
    message: err.message,
    stack: err.stack
  });
});

export default app;
