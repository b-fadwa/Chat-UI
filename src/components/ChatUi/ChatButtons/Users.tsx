import { FC } from 'react';
import { ChatList } from 'react-chat-elements';

interface UsersBarProps {
  allUsers: any[];
  setSelectedUser: (user: any) => void;
  setShowUsers: (show: boolean) => void;
  setSelectedConversation: (conversation: any) => void;
}

const UsersBar: FC<UsersBarProps> = ({
  allUsers,
  setSelectedUser,
  setShowUsers,
  setSelectedConversation,
}) => {
  const data = allUsers.map((user) => {
    return {
      avatar: 'https://img.freepik.com/free-icon/user_318-804790.jpg', //to fix
      title: user.lastName ? user.lastName : user.label,
      userID: user.ID,
    };
  });

  return (
    <div className="flex grow flex-col h-full justify-between">
      {data.length === 0 ? (
        <p className="text-gray-500 text-center">All Users</p>
      ) : (
        <ChatList
          {...({
            dataSource: data,
            onClick: (user: any) => {
              setSelectedUser(user.title);
            },
          } as any)}
          className="chat-bar-list overflow-auto"
        />
      )}
      <button
        className="go-to-users p-4 bg-gray-100 bottom-0 sticky"
        onClick={() => {
          setSelectedConversation(null);
          setShowUsers(false);
        }}
      >
        Go back to conversations
      </button>
    </div>
  );
};

export default UsersBar;
