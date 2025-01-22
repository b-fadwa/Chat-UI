import { FC } from 'react';
import { MessageList } from 'react-chat-elements';

interface ChatBodyProps {
  data: any;
}

// ws://websocket

const ChatBody: FC<ChatBodyProps> = ({ data }) => {
  let parsedItem: any;
  let isSender: boolean;
  data = data.map((item: any) => {
    parsedItem = JSON.parse(item);
    isSender = parsedItem.sender ? parsedItem.sender.startsWith('localhost') : true; //to be updated

    //nothing
    if (parsedItem.content == '' && !parsedItem.file && !parsedItem.audio && !parsedItem.image) {
      return null;
    }
    //text
    if (parsedItem.content)
      return {
        type: 'text',
        text: parsedItem.content,
        title: parsedItem.sender,
        position: isSender ? 'left' : 'right',
      };
    // file object
    if (parsedItem.file)
      return {
        type: 'file',
        text: 'File attached',
        title: parsedItem.sender,
        data: {
          uri: parsedItem.file,
          status: {
            click: false,
            loading: 0,
          },
          // status: {
          //   click: true,
          // },
        },
        file: parsedItem.file,
        url: parsedItem.file,
        position: isSender ? 'right' : 'left',
      };
    //audio object
    if (parsedItem.audio) {
      return {
        type: 'audio',
        title: parsedItem.sender,
        data: {
          audioURL: parsedItem.audio,
          status: {
            click: false,
            loading: 0,
          },
        },
        position: isSender ? 'right' : 'left',
      };
    }
    //video object
    if (parsedItem.video) {
    }
    //picture object
    if (parsedItem.image) {
      return {
        type: 'photo',
        title: parsedItem.sender,
        data: {
          uri: parsedItem.image,
          status: {
            click: false,
            loading: 0,
          },
        },
        position: isSender ? 'right' : 'left',
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
    <div className="chat-body">
      <MessageList
        {...({ dataSource: data } as any)}
        onDownload={(message: any) => {
          handleDownload(message);
        }}
        className="message-list bg-red-200"
      />
    </div>
  );
};

export default ChatBody;
