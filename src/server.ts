/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from 'http';
import app from './app';
import config from './app/config';

let server: Server;

const main = async () => {
  try {
    server = app.listen(config.port, () => {
      console.log(`Port running on: ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();

process.on('unhandledRejection', () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on('uncaughtException', () => {
  process.exit(1);
});
