import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Bottle } from '../types';

export function initializeWebSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_BASE_URL 
        : 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('send_bottle', (bottle: Bottle) => {
      // Broadcast the new bottle to all connected clients except the sender
      socket.broadcast.emit('receive_bottle', bottle);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
