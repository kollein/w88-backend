import express from 'express';
import { Router } from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from '@/middlewares/bodyParser';
import game from '@/router/game';
import user from '@/router/user';
import bet from '@/router/bet';
import view from '@/router/view';

export default function (app: Router, io: Server) {
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('./src/public'));

  // view
  view(app, io);

  const router = express.Router();
  // add router prefix
  app.use('/api', router);
  game(router);
  user(router);
  bet(router);
}
