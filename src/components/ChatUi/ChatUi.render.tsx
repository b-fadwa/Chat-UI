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

const ChatUi: FC<IChatUiProps> = ({
  userName,
  socketAddress,
  style,
  className,
  classNames = [],
}) => {
  const { connect } = useRenderer();
  const [socket, setSocket] = useState<any>();
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [messages, setMessages] = useState<any>([]);
  const [filteredMessages, setFilteredMessages] = useState<any>([]);
  const [conversations, setConversations] = useState<any>([]);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollID, setPollID] = useState<any>(getRandomId(50));
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<any>(null);

  useEffect(() => {
    if (!socketAddress && socketAddress !== '') return;
    const socketUrl = `${socketAddress}?userName=${userName}`; //used for login purposes
    const socket = new WebSocket(socketUrl);
    // const socket = new WebSocket(socketAddress);
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
      // socket.send(JSON.stringify({ userName: userName }));
    };
    //
    socket.onmessage = (event) => {
      const receivedMessages = event.data.split('\n').filter((msg: any) => msg.trim() !== '');
      const parsedMessages = receivedMessages.map((msg: any) => JSON.parse(msg));
      setMessages((prevMessages: any[]) => [...prevMessages, ...parsedMessages]);
      setFilteredMessages((prevMessages: any[]) => [...prevMessages, ...parsedMessages]);
      const usersArray = parsedMessages.flatMap((message: any) => message.users || []);
      const groups = parsedMessages.flatMap((message: any) => message.groups || []);
      setUsers((prevUsers: any[]) => [...prevUsers, ...usersArray, ...groups]);
      //n messages -> n-m convos
      // Store unique conversations
      // once a new message is receievd, the last message should be updated in the chatBar
      setConversations((prevConversations: any[]) => {
        const newConversations = new Map(prevConversations.map((conv) => [conv.ID, conv]));
        parsedMessages.forEach((msg: any) => {
          if (!msg.conversation) return;
          const conversationID = msg.conversation.ID;
          if (newConversations.has(conversationID)) {
            newConversations.set(conversationID, {
              ...newConversations.get(conversationID),
              lastMessage: msg,
            });
          } else {
            newConversations.set(conversationID, {
              ...msg.conversation,
              sender: msg.sender,
              receiver: msg.receiver,
              lastMessage: msg,
            });
          }
        });
        return Array.from(newConversations.values());
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
    socket.send(JSON.stringify({ poll: pollMessage }));
  };

  //get messages by convo id
  useEffect(() => {
    if (!selectedConversation && !selectedUser) {
      setFilteredMessages([]);
      return;
    }

    if (selectedConversation) {
      setSelectedReceiver(selectedConversation.title);
      const filtered = messages.filter(
        (msg: any) => msg.conversation?.ID === selectedConversation.conversationID,
      );
      setFilteredMessages(filtered);
    } else if (selectedUser) {
      setSelectedReceiver(selectedUser);
      const filtered = messages.filter(
        (msg: any) =>
          msg?.sender?.lastName === selectedUser ||
          msg?.receiver?.lastName === selectedUser ||
          msg?.receiver?.label === selectedUser,
      );
      setFilteredMessages(filtered);
    }
  }, [selectedConversation, messages, selectedUser]);

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <div className="chat-container flex flex-row gap-2 w-full h-full min-w-fit border-2">
        <div className="chat-left-panel flex flex-col w-1/4 border-r-2">
          <ChatHeader selectedConveration={selectedConversation} />
          <ChatBar
            setSelectedConversation={setSelectedConversation}
            conversations={conversations}
            setSelectedUser={setSelectedUser}
            allUsers={users}
            userName={userName}
          />
        </div>
        <div className="chat-right-panel flex flex-col w-3/4 p-2">
          <ChatBody
            key={filteredMessages.length}
            data={filteredMessages}
            socket={socket}
            pollID={pollID}
            userName={userName}
          />
          <ChatFooter
            socket={socket}
            onPollClick={() => setShowPollModal(true)}
            selectedReceiver={selectedReceiver}
          />
        </div>
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
    </div>
  );
};

export default ChatUi;
