import { FC } from 'react';
import { ChatList } from 'react-chat-elements';

interface UsersBarProps {
  allUsers: any[];
  setSelectedUser: (user: any) => void;
}

const UsersBar: FC<UsersBarProps> = ({ allUsers, setSelectedUser }) => {
  const data = allUsers.map((user) => {
    return {
      avatar: user.avatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg', //to fix
      title: user.lastName ? user.lastName : user.label,
      userID: user.ID,
    };
  });

  return (
    <div className=" overflow-auto">
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
          className="chat-bar-list"
        />
      )}
    </div>
  );
};

export default UsersBar;
