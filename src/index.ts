import http from 'http';
import app from './app';
import config from './config';

const server = http.createServer(app);

server.listen(config.server.port, () => {
  console.log(`Example app listening on port ${config.server.port}!`);
  console.log(`Environment: ${config.env}`);
});
