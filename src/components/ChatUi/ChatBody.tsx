import { FC } from 'react';
import { MessageList } from 'react-chat-elements';
import { format } from 'timeago.js';

interface ChatBodyProps {
  data: any;
}

// ws://websocket

const ChatBody: FC<ChatBodyProps> = ({ data }) => {
  let isSender: boolean;
  data = data.map((item: any) => {
    isSender = item.sender && item.sender == 'Client1' ? false : true; //to be updated
    if (item.content == '' && item.sender != '' && !item.file && !item.audio && !item.image) {
      return null;
    }
    //text
    if (item.content)
      return {
        type: 'text',
        text: item.content,
        title: item.sender,
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        position: isSender ? 'left' : 'right',
      };
    // file object
    if (item.file)
      return {
        type: 'file',
        text: 'File attached',
        title: item.sender,
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        data: {
          uri: item.file,
          status: {
            click: false,
            loading: 0,
          },
          // status: {
          //   click: true,
          // },
        },
        file: item.file,
        url: item.file,
        position: isSender ? 'left' : 'right',
      };
    //audio object
    if (item.audio) {
      return {
        type: 'audio',
        title: item.sender,
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
        // onClick: () => handleAudioPlay(item.audio),
      };
    }
    //picture object
    if (item.image) {
      return {
        type: 'photo',
        title: item.sender,
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
      };
    }
  });

  const handleDownload = (message: any) => {
    const fileUrl = message.data?.uri || message.data?.audioURL || message.data.url; //image or audio or file
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = message.type;
      link.click();
    }
  };

  return (
    <div className="chat-body flex-grow h-3/4 overflow-y-scroll">
      <MessageList
        {...({ dataSource: data } as any)}
        onDownload={(message: any) => {
          handleDownload(message);
        }}
        className="message-list"
      />
    </div>
  );
};

export default ChatBody;
