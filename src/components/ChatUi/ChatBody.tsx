import { FC } from 'react';
import { MessageList } from 'react-chat-elements';
import { format } from 'timeago.js';
import PollHandler from './ChatButtons/PollHandler';

interface ChatBodyProps {
  data: any;
  pollID: number;
  socket: WebSocket;
  userName: string;
}

const ChatBody: FC<ChatBodyProps> = ({ data, socket, userName }) => {
  data = data.map((item: any) => {
    let isSender: any = item.sender.lastName === userName ? false : true;

    if (
      item.content == '' &&
      item.sender.lastName != '' &&
      !item.file &&
      !item.audio &&
      !item.image &&
      !item.poll
    ) {
      return null;
    }
    //text
    if (item.content) {
      return {
        type: 'text',
        text: item.content,
        title: item.sender.lastName,
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        position: isSender ? 'left' : 'right',
        avatar: item.senderAvatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
    // file object
    if (item.file) {
      return {
        type: 'file',
        text: 'File attached',
        title: item.sender.lastName,
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        data: {
          uri: item.file,
          status: {
            click: false,
            loading: 0,
          },
        },
        file: item.file,
        url: item.file,
        position: isSender ? 'left' : 'right',
        avatar: item.senderAvatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
    //audio object
    if (item.audio) {
      return {
        type: 'audio',
        title: item.sender.lastName,
        data: {
          audioURL: item.audio,
          status: {
            click: false,
            loading: 0,
          },
        },
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        position: isSender ? 'left' : 'right',
        avatar: item.senderAvatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
    //picture object
    if (item.image) {
      return {
        type: 'photo',
        title: item.sender.lastName,
        data: {
          uri: item.image,
          status: {
            click: false,
            loading: 0,
          },
        },
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        position: isSender ? 'left' : 'right',
        avatar: item.senderAvatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
    //poll Object
    if (item.poll) {
      return {
        type: 'text',
        text: <PollHandler poll={item.poll} socket={socket} sender={item.sender} />,
        title: item.sender.lastName,
        position: isSender ? 'left' : 'right',
        avatar: item.senderAvatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
  });

  const handleDownload = (message: any) => {
    const fileUrl = message.data?.uri || message.data?.audioURL || message.data.url;
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = message.type;
      link.click();
    }
  };

  return (
    <div className="chat-body flex-grow h-3/4 overflow-y-scroll">
      {data.length === 0 ? (
        <p className="text-gray-500 text-center">Select a conversation or start a new one!</p>
      ) : (
        <MessageList
          {...({ dataSource: data } as any)}
          onDownload={(message: any) => {
            handleDownload(message);
          }}
          className="message-list"
        />
      )}
    </div>
  );
};

export default ChatBody;
