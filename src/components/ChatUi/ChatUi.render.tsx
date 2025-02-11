import { useRenderer } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';

import { IChatUiProps } from './ChatUi.config';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import PollModal from './ChatButtons/Poll';
import { getRandomId } from '@ws-ui/craftjs-utils';

const ChatUi: FC<IChatUiProps> = ({ socketAddress, style, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const [socket, setSocket] = useState<any>();
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [messages, setMessages] = useState<any>([]);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollID, setPollID] = useState<any>(getRandomId(50));


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
      console.log("Received WebSocket Message:", event.data);
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

  const handlePollSubmit = (poll: {
    pollID: number;
    question: string;
    options: string[];
    allowMultiple: boolean;
    selectedOptions: object;
  }) => {
    const pollMessage = {
      pollID: poll.pollID,
      question: poll.question,
      options: poll.options,
      allowMultiple: poll.allowMultiple,
      selectedOptions: poll.selectedOptions,
    };
    console.log(socket)
    socket.send(JSON.stringify({ poll: pollMessage }));
    setMessages((prev: any) => [...prev, JSON.stringify(pollMessage)]);
  };

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      setMessages((prev: any) => [...prev, JSON.stringify(message)]);
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <ChatHeader />
      <ChatBody key={messages.length} data={messages} socket={socket} pollID={pollID} />
      <ChatFooter socket={socket} onPollClick={() => setShowPollModal(true)} />
      <PollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
        onSubmit={(poll) => {
          handlePollSubmit(poll);
          setPollID(pollID);
        }}
        pollID={pollID}
      />

    </div>
  );
};

export default ChatUi;
