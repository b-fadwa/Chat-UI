import { FC } from 'react';
import { ChatList } from 'react-chat-elements';

interface ChatBarProps {
  setSelectedConversation: (conversation: any) => void;
  conversations: any[];
}

const ChatBar: FC<ChatBarProps> = ({ setSelectedConversation, conversations }) => {
  const data = conversations.map((conversation) => {
    return {
      avatar: 'https://img.freepik.com/free-icon/user_318-804790.jpg', 
      title: 'Convo ' + conversation.ID,
      conversationID: conversation.ID,
    };
  });

  return (
    <div className="chat-list bg-red-500">
      <ChatList
        {...({
          dataSource: data,
          onClick: (conversation: any) => {
            setSelectedConversation(conversation);
          },
        } as any)}
        className="chat-list"
      />
    </div>
  );
};

export default ChatBar;
