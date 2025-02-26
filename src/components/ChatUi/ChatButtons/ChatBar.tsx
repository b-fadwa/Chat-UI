import { FC, useState } from 'react';
import { ChatList } from 'react-chat-elements';
import { format } from 'timeago.js';
import UsersBar from './Users';

interface ChatBarProps {
  setSelectedConversation: (conversation: any) => void;
  conversations: any[];
  allUsers: any[];
  setSelectedUser: (user: any) => void;
  userName: string;
}

const ChatBar: FC<ChatBarProps> = ({
  setSelectedConversation,
  conversations,
  allUsers,
  setSelectedUser,
  userName,
}) => {
  const [showUsers, setShowUsers] = useState(false);

  const data = conversations.map((conversation) => {
    const receiverName: string = conversation.receiver.lastName
      ? conversation.receiver.lastName // Receiver is a user
      : conversation.receiver.label; // Receiver is a group

    const isReceiverAGroup = !conversation.receiver.lastName; // No lastName means it's a group

    return {
      avatar:
        conversation.receiver?.avatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      title: isReceiverAGroup
        ? receiverName // Always show group name if the receiver is a group
        : conversation.sender.lastName === userName
          ? receiverName === conversation.sender.lastName
            ? receiverName + ' (You)' // If sender and receiver are the same, add (You)
            : receiverName // Otherwise, just show the receiver
          : conversation.sender.lastName, // Show sender's name when you're not the sender
      conversationID: conversation.ID,
      subtitle: conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet',
      date: format(conversation.lastMessage.dateStamp),
      dateString: format(conversation.lastMessage.dateStamp),
      unread: conversation.lastMessage.isRead ? 0 : 1, //to fix
      statusColor: conversation.receiver.isActive ? 'green' : 'false',
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
          />
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center">Start a conversation to see messages here.</p>
        ) : (
          <ChatList
            {...({
              dataSource: data,
              onClick: (conversation: any) => {
                setSelectedConversation(conversation);
              },
            } as any)}
            className="chat-bar-list"
          />
        )}
      </div>
      <button
        className="go-to-users p-4 rounded bg-gray-100 bottom-px sticky"
        onClick={() => {
          setSelectedConversation(null);
          setShowUsers(true);
        }}
      >
        View all users
      </button>
    </div>
  );
};

export default ChatBar;
