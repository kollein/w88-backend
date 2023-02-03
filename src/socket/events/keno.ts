import { Server } from 'socket.io';
import kenoModel from '@/models/keno';

async function getLastRound() {
  return await kenoModel.findOne().sort({ _id: -1 });
}

export default async function kenoEvent(io: Server) {
  const lastRound = await getLastRound();
  io.emit('tiktok', { lastRound });
}
