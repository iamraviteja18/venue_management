'use client';

import { useRef, useState } from 'react';
import { type Socket } from 'socket.io-client';
import { SocketContext } from '../socket';

type SocketProviderProps = {
  children: React.ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  // State
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        setSocket: (s) => {
          setSocket(s);
        },
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
