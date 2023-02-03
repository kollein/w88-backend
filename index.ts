console.log('start loop');
console.time('loop');
console.time('loop2');
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import env from '@root/env';
import router from '@/router/index';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import runHeartBeat from '@/scheduler/index';

// timezone
process.env.TZ = 'Asia/Bangkok';
console.log(new Date().toString());
const { PORT } = env();

// mongodb
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/test').then(() => {
  console.log('mongodb: connected!');
  console.timeEnd('loop2');
});

// express
const app = express();

// http/https
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// router
router(app, io);

// socket
io.on('connection', (socket) => {
  // list client ip in the whitelist to prevent access from the unknown
  const { remoteAddress } = socket.client.conn;
  console.log('a user connected', remoteAddress);

  socket.on('disconnect', () => {
    console.log('user disconnected', remoteAddress);
  });
});

// run the heart beat to perform the process in every second
// runHeartBeat();

// server
httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
  console.timeEnd('loop');
});
