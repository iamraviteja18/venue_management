import { Button, Flex, FloatButton, Input, Popover } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../socket';
import { PiChatTextBold } from 'react-icons/pi';
import { TbSend } from 'react-icons/tb';
import { useRecoilValue } from 'recoil';
import userState from '@/state/user';

/* TYPES */

type Message = {
  roomId: string;
  senderId: string;
  senderName: string;
  message: string;
};

type ChatWindowProps = {
  roomId: string;
};

/* COMPONENT */

export const ChatWindow = ({ roomId }: ChatWindowProps) => {
  // State
  const sessionUser = useRecoilValue(userState);

  const { socket } = useContext(SocketContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  // Lifecycle
  useEffect(() => {
    if (!socket) return;

    socket.emit('join_room', roomId);

    socket.on('receive_msg', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, socket]);

  // Handlers
  const sendMessage = () => {
    if (!socket || !sessionUser) return;

    const msg: Message = {
      roomId,
      senderId: sessionUser._id,
      senderName: sessionUser.name,
      message: currentMessage,
    };

    socket.emit('send_msg', msg);
    setCurrentMessage('');
  };

  const renderChatWindow = () => {
    return (
      <Flex gap='8px' vertical>
        <div
          style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}
        >
          <Flex gap='8px' vertical>
            {messages.map((message, index) => (
              <Flex
                key={index}
                align={
                  message.senderId === sessionUser?._id
                    ? 'flex-start'
                    : 'flex-end'
                }
                vertical
              >
                <span>{message.senderName}</span>
                <span>{message.message}</span>
              </Flex>
            ))}
          </Flex>
        </div>
        <Flex gap='8px'>
          <Input
            placeholder='Type a message...'
            onChange={(e) => setCurrentMessage(e.currentTarget.value)}
            value={currentMessage}
          />
          <Button
            disabled={!Boolean(socket)}
            icon={<TbSend />}
            onClick={() => sendMessage()}
            type='primary'
          />
        </Flex>
      </Flex>
    );
  };

  return (
    <Popover content={renderChatWindow()} placement='topRight' trigger='click'>
      <FloatButton icon={<PiChatTextBold />} />
    </Popover>
  );
};
