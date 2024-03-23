import { getCookie } from 'cookies-next';
import { createContext } from 'react';
import socketio, { type Socket } from 'socket.io-client';

export const createSocketClient = () => {
  const url = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
      ? `http://${process.env.NEXT_PUBLIC_API_URL}`
      : `https://${process.env.NEXT_PUBLIC_API_URL}`
    : '';

  const authCookie = getCookie('access_token');

  const socket = socketio(url, {
    query: { token: authCookie },
  });

  return socket;
};

export const SocketContext = createContext<{
  socket: Socket | undefined;
  setSocket: (socket: Socket) => void;
}>({
  socket: undefined,
  setSocket: (_: Socket) => {
    return;
  },
});
