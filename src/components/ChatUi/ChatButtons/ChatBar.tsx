import { FC, useEffect, useState } from 'react';
import { ChatList } from 'react-chat-elements';
import { format } from 'timeago.js';
import UsersBar from './Users';

interface ChatBarProps {
  setSelectedConversation: (conversation: any) => void;
  conversations: any[];
  allUsers: any[];
  setSelectedUser: (user: any) => void;
  userName: string;
  socket: any;
}

const ChatBar: FC<ChatBarProps> = ({
  setSelectedConversation,
  conversations,
  allUsers,
  setSelectedUser,
  userName,
  socket,
}) => {
  const [showUsers, setShowUsers] = useState(false);
  const [chatData, setChatData] = useState(conversations);

  useEffect(() => {
    //ordering the list by last received message
    const sortedConversations = [...conversations].sort((a, b) => {
      return (
        new Date(b.lastMessage.dateStamp).getTime() - new Date(a.lastMessage.dateStamp).getTime()
      );
    });
    setChatData(sortedConversations);
  }, [conversations]);

  const handleConversationClick = (conversation: any) => {
    setSelectedConversation(conversation);
    const updatedConversations = chatData.map((convo) =>
      convo.ID === conversation.conversationID
        ? { ...convo, lastMessage: { ...convo.lastMessage, isRead: true } }
        : convo,
    );
    socket.send(JSON.stringify({ isRead: true, conversationID: conversation.conversationID })); //to update DB
    setChatData(updatedConversations); // Update state to trigger re-render
  };

  const data = chatData.map((conversation) => {
    const receiverName: string = conversation.receiver.fullName
      ? conversation.receiver.fullName // Receiver is a user
      : conversation.receiver.label; // Receiver is a group
    const isReceiverAGroup = !conversation.receiver.fullName; // No fullName means it's a group
    const content = conversation.lastMessage.content //no text message => possible attachment
      ? conversation.lastMessage.content
      : 'Attachment received';
    const receiverPic =
      conversation.lastMessage.sender.fullName === userName
        ? conversation.lastMessage.receiverAvatar
        : conversation.lastMessage.senderAvatar; //receiver pic

    return {
      avatar: receiverPic || 'https://img.freepik.com/free-icon/user_318-804790.jpg', //avatar of the convo receiver
      title: isReceiverAGroup
        ? receiverName // Always show group name if the receiver is a group
        : conversation.sender.fullName === userName
          ? receiverName === conversation.sender.fullName
            ? receiverName // If sender and receiver are the same
            : receiverName // Otherwise, just show the receiver
          : conversation.sender.fullName, // Show sender's name when you're not the sender
      conversationID: conversation.ID,
      subtitle: conversation.receiver.label
        ? conversation.lastMessage.sender.fullName + ':' + content
        : content,
      date: format(conversation.lastMessage.dateStamp),
      dateString: format(conversation.lastMessage.dateStamp),
      unread: conversation.lastMessage.isRead ? 0 : 1,
      statusColor: conversation.receiver.isActive ? 'green' : 'transparent',
    };
  });

  return (
    <div className="chat-bar overflow-auto h-full flex flex-col justify-between">
      <div className="myConversations grow">
        {showUsers ? (
          <UsersBar
            allUsers={allUsers}
            setSelectedUser={(user: any) => {
              setShowUsers(false);
              setSelectedUser(user);
            }}
            setShowUsers={setShowUsers}
            setSelectedConversation={setSelectedConversation}
          />
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center">Start a conversation to see messages here.</p>
        ) : (
          <ChatList
            {...({
              dataSource: data,
              onClick: (conversation: any) => {
                handleConversationClick(conversation);
              },
            } as any)}
            className="chat-bar-list overflow-auto"
          />
        )}
      </div>
      {!showUsers && (
        <button
          className="go-to-users p-4 bg-gray-100 bottom-0 sticky"
          onClick={() => {
            setSelectedConversation(null);
            setShowUsers(true);
          }}
        >
          View all users
        </button>
      )}
    </div>
  );
};

export default ChatBar;
