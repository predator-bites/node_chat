import EventEmitter from 'node:events';
import { createServer } from './createServer';
import { WebSocketServer, WebSocket } from 'ws';
import { prisma } from './db';

export const emitter = new EventEmitter();

const PORT = process.env.PORT || 3005;

const server = createServer().listen(PORT);

const wss = new WebSocketServer({ server });

emitter.on('message', (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();

  server.close(() => {
    process.exit(0);
  });
});
