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
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    if (!socketAddress && socketAddress !== '') return;
    // Create a WebSocket connection
    const socket = new WebSocket(socketAddress);
    socket.onopen = () => {
      setConnectionStatus('Connected');
      console.log('WebSocket connection established');
      setValue(socket);
    };
    socket.onmessage = (event) => {
      setMessage((prev) => prev + event.data);
    };

    socket.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log('WebSocket connection closed');
    };

    // Event listener for errors
    socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    const getMessage = () => {
      socket.addEventListener('message', (event) => {});
    };

    getMessage();

    // Cleanup on component unmount
    return () => {
      socket.removeEventListener('message', getMessage);
      socket.close();
    };
  }, [socketAddress]);

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <ChatHeader />
      <ChatBody key={message} position={position} data={message} />
      <ChatFooter />
      <button onClick={() => value.send('Hello Qodly')}>Send</button>
      {message}
    </div>
  );
};

export default ChatUi;
