import EventEmitter from 'node:events';
import { createServer } from './createServer';
import { WebSocketServer } from 'ws';
import { prisma } from './db';

export const emitter = new EventEmitter();

const server = createServer().listen(3005, () => {
  console.log('Server is working on 3005');
});

const wss = new WebSocketServer({ server });

emitter.on('message', (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received');

  await prisma.$disconnect();

  server.close(() => {
    console.log('Server closed gracefully');

    process.exit(0);
  });
});
