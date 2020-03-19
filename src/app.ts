import path from 'path';
import childProcess from 'child_process';
import express, { ErrorRequestHandler } from 'express';
import morgan from 'morgan';

import ApplicationError from './utils/ApplicationError';
import getScriptNameFromRequestUrl from './utils/getScriptNameFromRequestUrl';
import checkScriptExists from './utils/checkScriptExists';
import config from './config';

const app = express();

app.use(morgan('combined'));

app.post<{ alias: string }>(
  '/api/projects/:alias/build',
  async (req, res, next) => {
    const { alias } = req.params;
    const { force } = req.query as { force?: boolean };

    const scriptName = getScriptNameFromRequestUrl(req.url);
    const pathToScript = path.resolve(config.settings.scriptsFolderPath, alias);

    await checkScriptExists(pathToScript);

    childProcess.execFile(pathToScript);

    res.status(200).send(`Script "${scriptName}" started to execute!`);
  },
);

app.get('/api/status', async (req, res, next) => {
  res.status(200).send('Everything is ok');
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error);
  const status = error instanceof ApplicationError ? error.status : 500;
  res.status(status).send(error.message);
};

app.use(errorHandler);

export default app;
