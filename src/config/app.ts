import path from 'path';
import { config } from 'dotenv';

config({
  path: path.resolve(__dirname, '../../.env'),
});

if (!process.env.SCRIPTS_PATH) {
  throw new Error('Env variable "SCRIPT_PATH" is not specified');
}

export default {
  env: process.env.NODE_ENV ?? 'development',
  server: {
    host: process.env.HOST ?? 'localhost',
    port: Number.parseInt(process.env.PORT ?? '', 10) || 3000,
  },
  settings: {
    scriptsFolderPath: process.env.SCRIPTS_PATH ?? '',
  },
};
