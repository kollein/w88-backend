import { Router } from 'express';
import { Server } from 'socket.io';
import path from 'path';
import env from '@root/env';

export default function view(app: Router, io: Server) {
  const { INDEX } = env();
  const publicIndexFilePath = path.resolve(`./src/views/${INDEX}`);
  console.log('publicIndexFilePath', publicIndexFilePath);
  app.get('/', (req, res) => {
    res.sendFile(publicIndexFilePath);
  });
}
