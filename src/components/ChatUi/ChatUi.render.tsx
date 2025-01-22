import { useRenderer } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';

import { IChatUiProps } from './ChatUi.config';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatUi: FC<IChatUiProps> = ({
  socketAddress,
  position,
  style,
  className,
  classNames = [],
}) => {
  const { connect } = useRenderer();
  const [value, setValue] = useState<any>();

  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState<any>([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    if (!socketAddress && socketAddress !== '') return;

    const socket = new WebSocket(socketAddress);
    socket.onopen = () => {
      setConnectionStatus('Connected');
      console.log('WebSocket connection established');
      setValue(socket);
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      const datamessages = event.data.split('\n').filter((msg: any) => msg.trim() !== '');
      setMessages((prev: any) => [...prev, ...datamessages]);
    };

    socket.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    const getMessage = () => {
      socket.addEventListener('message', (event) => { });
    };

    getMessage();

    return () => {
      socket.removeEventListener('message', getMessage);
      socket.close();
    };
  }, [socketAddress]);

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <ChatHeader />
      <ChatBody key={message} position={position} data={messages} />
      <ChatFooter socket={value} />
    </div>
  );
};

export default ChatUi;
