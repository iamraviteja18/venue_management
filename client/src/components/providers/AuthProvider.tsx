'use client';

import { useRecoilState } from 'recoil';
import userState from '@/state/user';
import { useContext, useEffect } from 'react';
import AuthService from '@/services/auth';
import { SocketContext, createSocketClient } from '../socket';

export const AuthProvider = () => {
  // State
  const { setSocket } = useContext(SocketContext);

  const [user, setUser] = useRecoilState(userState);

  // Helpers
  const fetchUser = async () => {
    const res = await AuthService.GetMe();
    setUser(res || null);

    if (res) {
      const socket = createSocketClient();
      setSocket(socket);
    }
  };

  // Lifecycle
  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  return <></>;
};
