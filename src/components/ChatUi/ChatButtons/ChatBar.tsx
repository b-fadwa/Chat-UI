import { FC } from 'react';
import { ChatList } from 'react-chat-elements';
import { format } from 'timeago.js';

interface ChatBarProps {
  setSelectedConversation: (conversation: any) => void;
  conversations: any[];
}

const ChatBar: FC<ChatBarProps> = ({ setSelectedConversation, conversations }) => {
  const data = conversations.map((conversation) => {
    return {
      avatar:
        conversation.receiver.avatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg', //to fix
      title: conversation.receiver.firstName,
      conversationID: conversation.ID,
      subtitle: conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet',
      date: format(conversation.lastMessage.dateStamp),
      dateString: format(conversation.lastMessage.dateStamp),
      unread: conversation.lastMessage.isRead ? 0 : 1, //to fix
    };
  });

  return (
    <div className="chat-bar">
      {data.length === 0 ? (
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
  );
};

export default ChatBar;
