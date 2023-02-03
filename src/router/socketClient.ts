import { Router } from 'express';
import { Server } from 'socket.io';
import path from 'path';

export default function socketClient(router: Router, io: Server) {
  // socket client transmitter
  const publicIndexFilePath = path.resolve('./src/index.html');
  console.log('publicIndexFilePath', publicIndexFilePath);
  router.get('/client', (req, res) => {
    res.sendFile(publicIndexFilePath);
  });
}
