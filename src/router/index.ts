import express from 'express';
import { Router } from 'express';
import { Server } from 'socket.io';
import game from '@/router/game';
import user from '@/router/user';
import bet from '@/router/bet';
// import socketClient from './socketClient';
import cors from 'cors';
import bodyParser from '@/middlewares/bodyParser';
import path from 'path';

export default function (app: Router, io: Server) {
//   const router = express.Router();
  app.use(cors());
  app.use(express.json());
  // app.use(bodyParser);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('./src/public'));

  // socket client transmitter
  const publicIndexFilePath = path.resolve('./src/transmitter/local.html');
  console.log('publicIndexFilePath', publicIndexFilePath);
  app.get('/', (req, res) => {
    res.sendFile(publicIndexFilePath);
  });

  // add router prefix
//   app.use('/api', router);
//   game(router);
//   user(router);
//   bet(router);
}
