import { Server } from 'socket.io';
import kenoScheduler from '@/scheduler/keno/index';
import kenoEvent from '@/socket/events/keno';

export default function (io: Server) {
  setInterval(() => {
    // keno
    kenoScheduler();
    kenoEvent(io);
  }, 1000);
}
