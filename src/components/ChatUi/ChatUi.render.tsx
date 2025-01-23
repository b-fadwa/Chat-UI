import { useRenderer } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';

import { IChatUiProps } from './ChatUi.config';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatUi: FC<IChatUiProps> = ({ socketAddress, style, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const [socket, setSocket] = useState<any>();
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    console.log('socket useeffect executeeed!!!');

    if (!socketAddress && socketAddress !== '') return;

    const socket = new WebSocket(socketAddress);
    //testing purpose only
    if (socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket is alive and open.');
    } else {
      console.log('WebSocket is not open. Current state:', socket.readyState);
    }
    //
    socket.onopen = () => {
      setConnectionStatus('Connected');
      console.log('WebSocket connection established');
      setSocket(socket);
    };
    //
    socket.onmessage = (event) => {
      const datamessages = event.data.split('\n').filter((msg: any) => msg.trim() !== '');
      setMessages((prev: any) => [...prev, ...datamessages]);
    };

    socket.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log('WebSocket connection closed');
    };
    // Event listener for errors
    socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };
    //close socket
    return () => {
      if (socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
    };
  }, [socketAddress]);

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <ChatHeader />
      <ChatBody key={messages} data={messages} />
      <ChatFooter socket={socket} />
    </div>
  );
};

export default ChatUi;
