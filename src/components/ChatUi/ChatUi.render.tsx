import { useRenderer } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';

import { IChatUiProps } from './ChatUi.config';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import PollModal from './ChatButtons/Poll';
import { getRandomId } from '@ws-ui/craftjs-utils';
import ChatBar from './ChatButtons/ChatBar';

const ChatUi: FC<IChatUiProps> = ({ socketAddress, style, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const [socket, setSocket] = useState<any>();
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [messages, setMessages] = useState<any>([]);
  const [filteredMessages, setFilteredMessages] = useState<any>([]);
  const [conversations, setConversations] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollID, setPollID] = useState<any>(getRandomId(50));

  const [selectedConversation, setSelectedConversation] = useState<any>(null);

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
      const receivedMessages = event.data.split('\n').filter((msg: any) => msg.trim() !== '');
      const parsedMessages = receivedMessages.map((msg: any) => JSON.parse(msg));
      setMessages((prevMessages: any[]) => [...prevMessages, ...parsedMessages]);
      setFilteredMessages((prevMessages: any[]) => [...prevMessages, ...parsedMessages]);
      //n messages -> n-m convos
      // Store unique conversations
      setConversations((prevConversations: any) => {
        const newConversations = [...prevConversations];
        receivedMessages
          .map((msg: any) => JSON.parse(msg))
          .forEach((msg: any) => {
            if (
              msg.conversation &&
              !newConversations.find((conv) => conv.ID === msg.conversation.ID)
            ) {
              newConversations.push(msg.conversation);
            }
          });
        return newConversations;
      });
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
  };



  //get messages by convo id
  useEffect(() => {
    if (!selectedConversation) {
      setFilteredMessages([]);
    } else {
      const filtered = messages.filter(
        (msg: any) => msg.conversation?.ID === selectedConversation.conversationID,
      );
      setFilteredMessages(filtered);
    }
  }, [selectedConversation, messages]);

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <div className="flex flex-row gap-2 w-full">
        <div className="flex flex-col w-1/4">
          <ChatHeader selectedConveration={selectedConversation} />
          <ChatBar
            setSelectedConversation={setSelectedConversation}
            conversations={conversations}
          />
        </div>
        <div className="flex flex-col w-3/4">
          <ChatBody key={filteredMessages} data={filteredMessages} socket={socket} pollID={pollID}/>
          <ChatFooter socket={socket} onPollClick={() => setShowPollModal(true)} />
        </div>
        <PollModal
          isOpen={showPollModal}
          onClose={() => setShowPollModal(false)}
          onSubmit={handlePollSubmit}
          pollID={pollID}
        />
      </div>
    </div>
  );
};

export default ChatUi;
